import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import crypto from 'crypto';

export const runtime = 'nodejs';

type ProcessedFile = {
  name: string;
  evidenceId: string;
  hash: string;
  size: number;
  type: string;
  timestamp: string;
  status: 'success' | 'rejected';
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const processedFiles: ProcessedFile[] = [];
    const fileDescriptions: string[] = [];

    for (const file of files) {
      if (file.size > 100 * 1024 * 1024) {
        processedFiles.push({
          name: file.name,
          evidenceId: crypto.randomUUID(),
          hash: '',
          size: file.size,
          type: file.type,
          timestamp: new Date().toISOString(),
          status: 'rejected',
          error: 'File exceeds 100MB limit',
        });
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const sizeKB = Math.round(buffer.length / 1024);
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      processedFiles.push({
        name: file.name,
        evidenceId: crypto.randomUUID(),
        hash,
        size: file.size,
        type: file.type,
        timestamp: new Date().toISOString(),
        status: 'success',
      });

      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = buffer.toString('utf-8').slice(0, 8000);
        fileDescriptions.push(`[TEXT FILE: ${file.name}]\n${text}`);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        fileDescriptions.push(`[PDF DOCUMENT: ${file.name}, ${sizeKB}KB — extract all text, dates, parties, and key facts from this document]`);
      } else if (file.type.startsWith('image/')) {
        fileDescriptions.push(`[IMAGE FILE: ${file.name}, ${sizeKB}KB — describe what legal evidence this might contain]`);
      } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        fileDescriptions.push(`[MEDIA FILE: ${file.name}, ${sizeKB}KB — this is audio/video evidence, note its existence and potential evidentiary value]`);
      } else {
        fileDescriptions.push(`[DOCUMENT: ${file.name}, type: ${file.type}, ${sizeKB}KB]`);
      }
    }

    const acceptedFileNames = processedFiles
      .filter((f) => f.status === 'success')
      .map((f) => f.name);

    if (!acceptedFileNames.length) {
      return NextResponse.json(
        {
          success: false,
          message: 'No files processed',
          files: processedFiles,
          forensicReady: false,
          error: 'All uploaded files were rejected by validation',
        },
        { status: 400 }
      );
    }

    const prompt = `You are UJRIS — an Autonomous Litigation Intelligence Engine. Analyse these ${files.length} evidence file(s) and extract structured intelligence for a self-litigant.

FILES:
${fileDescriptions.join('\n\n')}

Return a JSON object with exactly these fields:
{
  "parties": ["list of people, companies, organisations mentioned"],
  "dates": ["key dates and what happened on each"],
  "facts": ["specific factual claims that can be evidenced"],
  "contradictions": ["inconsistencies, anomalies, or contradictions detected"],
  "keyDocuments": ["which documents are most important and why"],
  "caseStrength": <integer 0-100>,
  "summary": "plain-English paragraph summarising the case",
  "recommendedActions": ["specific legal actions the claimant should take next"]
}

Be thorough. Flag every contradiction. Score case strength honestly based on evidence quality and completeness.`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        ...mockExtraction(acceptedFileNames),
        success: true,
        message: `${processedFiles.filter((f) => f.status === 'success').length} file(s) processed`,
        files: processedFiles,
        forensicReady: true,
      });
    }

    const openai = new OpenAI({ apiKey });
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return NextResponse.json({
        ...result,
        success: true,
        message: `${processedFiles.filter((f) => f.status === 'success').length} file(s) processed`,
        files: processedFiles,
        forensicReady: true,
      });
    } catch (modelErr) {
      console.error('Evidence AI extraction error:', modelErr);
      return NextResponse.json({
        ...mockExtraction(acceptedFileNames),
        success: true,
        message: `${processedFiles.filter((f) => f.status === 'success').length} file(s) processed (AI unavailable, fallback mode)`,
        files: processedFiles,
        forensicReady: true,
      });
    }
  } catch (err) {
    console.error('Evidence processing error:', err);
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: err instanceof Error ? err.message : String(err),
        fallback: 'Use local processing fallback in Evidence Hub',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    maxFileSize: '100MB',
    supportedTypes: ['image/*', 'application/pdf', 'text/*', 'audio/*', 'video/*'],
  });
}

function mockExtraction(fileNames: string[]) {
  return {
    parties: ['Claimant (You)', 'Respondent (Employer/Defendant)', 'HR Manager', 'Line Manager'],
    dates: [`${fileNames.length} file(s) uploaded — dates to be extracted from content`],
    facts: [
      `${fileNames.length} evidence file(s) submitted for analysis`,
      'Evidence hub is operational — connect OPENAI_API_KEY for full AI extraction',
    ],
    contradictions: [],
    keyDocuments: fileNames,
    caseStrength: 45,
    summary: `${fileNames.length} file(s) have been uploaded to the Evidence Hub. To unlock full AI-powered extraction of facts, dates, parties, and contradictions, add your OPENAI_API_KEY to the environment variables.`,
    recommendedActions: [
      'Add OPENAI_API_KEY to .env.local for full AI analysis',
      'Ensure all evidence is preserved in original form',
      'Create a chronological index of all documents',
    ],
  };
}

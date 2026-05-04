import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type DocumentType = 'et1' | 'witness_statement' | 'grievance' | 'skeleton_argument' | 'appeal' | 'schedule_loss' | 'subject_access_request';

const DOCUMENT_PROMPTS: Record<DocumentType, string> = {
  et1: `You are drafting an Employment Tribunal ET1 claim form for a self-litigant.
Write a professional, legally structured claim using the facts provided.
Include: Claimant's details section, Employer details section, Type of claim (discrimination, unfair dismissal, etc.), Detailed facts in numbered paragraphs, Remedy sought.
Use clear, plain English. Be factual, not emotional. Cite specific dates and documents.`,

  witness_statement: `You are drafting a formal witness statement for Employment Tribunal proceedings.
Format: "I, [NAME], of [ADDRESS], make this statement..."
Include: Introduction and role, Chronological account of events with specific dates, Reference to supporting documents (exhibit numbers), Clear factual assertions, Statement of truth at end.
Use first person. Be specific. Avoid opinion unless invited.`,

  grievance: `You are drafting a formal grievance letter under the ACAS Code of Practice.
Include: Date, addressee (HR/manager), Subject line "FORMAL GRIEVANCE — [SUBJECT]", Summary of grievance, Detailed account with dates, Impact on claimant, Specific remedy sought, Request for meeting, Signature block.
Cite relevant employment law where appropriate.`,

  skeleton_argument: `You are drafting a skeleton argument for an Employment Tribunal hearing.
Format: Case title, Hearing date, Introduction (2 sentences), Issues to be determined (numbered list), Relevant law (statutes and cases), Submissions on facts (numbered), Submissions on law, Relief sought.
Keep each section concise. Bold key propositions. Reference evidence bundle by exhibit number.`,

  appeal: `You are drafting an appeal notice for an Employment Tribunal decision.
Include: Case reference, Original decision date, Grounds of appeal (each numbered and specific), Legal basis for each ground, Relief sought.
Grounds must identify error of law, not mere disagreement with findings of fact.`,

  schedule_loss: `You are drafting a Schedule of Loss for an Employment Tribunal claim.
Include: Table of losses (past loss of earnings, future loss, pension loss, injury to feelings), Calculation methodology, Interest calculations, Total amount claimed, Supporting assumptions.
Be precise with figures. Show all calculations step-by-step.`,

  subject_access_request: `You are drafting a Subject Access Request (SAR) under UK GDPR / Data Protection Act 2018.
Include: Date, Addressee (Data Controller/DPO), "SUBJECT ACCESS REQUEST" heading, Identity confirmation, Specific categories of data requested (emails, HR records, disciplinary files, CCTV), Response deadline reminder (1 month), Request for data in machine-readable format.
Keep formal but clear.`,
};

export async function POST(req: Request) {
  try {
    const { documentType, caseFacts, parties, timeline, additionalContext } = await req.json();

    if (!documentType) {
      return NextResponse.json({ error: 'documentType is required' }, { status: 400 });
    }

    const docType = documentType as DocumentType;
    if (!DOCUMENT_PROMPTS[docType]) {
      return NextResponse.json({ error: `Unknown documentType: ${documentType}. Valid types: ${Object.keys(DOCUMENT_PROMPTS).join(', ')}` }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        mock: true,
        document: `[${documentType.toUpperCase()} TEMPLATE]\n\nAdd OPENAI_API_KEY to generate a real ${documentType} document.\n\nProvided facts:\n${JSON.stringify(caseFacts, null, 2)}`,
        documentType,
        message: 'Connect OPENAI_API_KEY for AI-powered document drafting',
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const userContent = [
      caseFacts ? `CASE FACTS:\n${typeof caseFacts === 'string' ? caseFacts : JSON.stringify(caseFacts, null, 2)}` : '',
      parties ? `PARTIES:\n${typeof parties === 'string' ? parties : JSON.stringify(parties, null, 2)}` : '',
      timeline ? `TIMELINE:\n${typeof timeline === 'string' ? timeline : JSON.stringify(timeline, null, 2)}` : '',
      additionalContext ? `ADDITIONAL CONTEXT:\n${additionalContext}` : '',
    ].filter(Boolean).join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: DOCUMENT_PROMPTS[docType] },
        { role: 'user', content: userContent || 'Draft this document with placeholder values where specific facts are not provided.' },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const document = response.choices[0].message.content ?? '';

    return NextResponse.json({
      document,
      documentType,
      wordCount: document.split(/\s+/).length,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Document draft error:', err);
    return NextResponse.json({ error: 'Document drafting failed', detail: String(err) }, { status: 500 });
  }
}

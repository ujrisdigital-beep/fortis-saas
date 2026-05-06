'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComplaintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    isAnonymous: true,
    complainantName: '',
    complainantPhone: '',
    complainantEmail: '',
    mdaId: '',
    mdaName: '',
    complaintText: '',
    complaintLanguage: 'en',
    evidenceUrls: [] as string[],
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [step, setStep] = useState(1);
  const [caseNumber, setCaseNumber] = useState('');
  const [error, setError] = useState('');

  const mdList = [
    { id: 'MOFEA', name: 'Ministry of Finance and Economic Affairs' },
    { id: 'MOTIE', name: 'Ministry of Trade, Industry and Employment' },
    { id: 'MOHERST', name: 'Ministry of Higher Education, Research, Science and Technology' },
    { id: 'MOH', name: 'Ministry of Health' },
    { id: 'MOA', name: 'Ministry of Agriculture' },
    { id: 'MOLG', name: 'Ministry of Local Government' },
    { id: 'MOJ', name: 'Ministry of Justice' },
    { id: 'MOL', name: 'Ministry of Labour' },
    { id: 'POLICE', name: 'Gambia Police Force' },
    { id: 'NAWEC', name: 'NAWEC' },
    { id: 'PURA', name: 'Public Utilities Regulatory Authority' },
    { id: 'GRA', name: 'Gambia Revenue Authority' },
    { id: 'GBOS', name: 'Gambia Bureau of Statistics' },
    { id: 'GIEPA', name: 'Gambia Investment and Export Promotion Agency' },
    { id: 'OTHER', name: 'Other Government Agency' },
  ];

  const content = {
    en: {
      title: 'File a Complaint',
      step1: 'Tell us what happened',
      step2: 'Upload evidence',
      step3: 'Review & submit',
      anonymous: 'Submit anonymously',
      anonymousHelp: 'Your identity will be protected. We will never share your information.',
      name: 'Your full name',
      phone: 'Phone number (for updates)',
      email: 'Email address (optional)',
      selectMDA: 'Select the ministry or agency',
      complaintDetails: 'Describe what happened',
      complaintPlaceholder:
        'Tell us your story in your own words. Include dates, names of people involved, and what you believe was unfair...',
      uploadEvidence: 'Upload supporting documents',
      uploadHint: 'Contracts, letters, photos, or any evidence (PDF, JPG, PNG, DOC - Max 10MB each)',
      submit: 'Submit Complaint',
      back: 'Back',
      success: 'Complaint Submitted Successfully',
      caseNumber: 'Your case number is',
      trackLink: 'Track your case here',
      uploading: 'Uploading files...',
      selectLanguage: 'Complaint language',
    },
    mandinka: {
      title: 'Kumakaŋo Dondoma',
      step1: 'Moo ye meŋ soŋ i la fo i ye',
      step2: 'Seekoo toolu baara',
      step3: 'Jaakiradulaŋo',
      anonymous: 'Tɔɔ taa la dondoma',
      anonymousHelp: 'I la tɔɔ ka kantɔ. M̀ be seerata la i la kumakaŋo la.',
      name: 'I tɔɔ faŋo',
      phone: 'Sawoo sooritaa (kumakaŋo fere filiferoo la)',
      email: 'Imeyilii saaboo (tomma)',
      selectMDA: 'Minisitaa laa le',
      complaintDetails: 'Moo le soŋ?',
      complaintPlaceholder: 'I la kumakaŋo safe i la kumaalu la. Taanaroo, toŋo tɔɔ le ti, la moo le i seŋ i lafaara tilifaroo...',
      uploadEvidence: 'Seekoo toolu baara',
      uploadHint: 'Kontirakiti, leetari, foto, laa le (PDF, JPG, PNG, DOC - 10MB fo leore)',
      submit: 'Kumakaŋo Dondoma',
      back: 'Baa',
      success: 'Kumakaŋo Dondoma Ka Tilaadiri',
      caseNumber: 'I la mootoo sooritaa mu',
      trackLink: 'I la mootoo jaakiroo jee',
      uploading: 'Seekoo seeratɔndi...',
      selectLanguage: 'Kumakaŋo kumaalu',
    },
    pulaar: {
      title: 'Petto Nekka',
      step1: 'Haala kawral maa',
      step2: 'Ɓeyda golle maa',
      step3: 'Ƴeewto e neldu',
      anonymous: 'Neldu e innde mum',
      anonymousHelp: 'Innde maa nana. En njaɓataa feɗɗude neekka maa.',
      name: 'Innde mum timmunde',
      phone: 'Limoo nokkuure (habaruuji)',
      email: 'Adrese iimeyl (hay na\'i)',
      selectMDA: 'Ministeer walla fedde laawol',
      complaintDetails: 'Haala kawral maa',
      complaintPlaceholder: 'Petto maa mbaŋŋe maa. Waxtu, toɗɗuɓe wonduɓe, e ko njiiniri maa lafaara tilifaroo...',
      uploadEvidence: 'Ɓeyda golle ɗe',
      uploadHint: 'Kontraak, ɓataake, fotooji, walla golle goɗɗe (PDF, JPG, PNG, DOC - 10MB ngam gollal)',
      submit: 'Neldu Petto',
      back: 'Gaɗoo',
      success: 'Petto Neldaama',
      caseNumber: 'Limoo petto maa',
      trackLink: 'Luttoo petto maa',
      uploading: 'Mbaɗɗa golle...',
      selectLanguage: 'Ɓeynu kumaagul petto',
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Upload files first
      const evidenceUrls = await uploadFiles();

      const res = await fetch('/api/ombudsman/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          evidenceUrls,
          complaintLanguage: language,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCaseNumber(data.caseNumber);
        setStep(4);
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-bold mb-2">{t.success}</h2>
          <p className="text-gray-600 mb-4">{t.caseNumber}</p>
          <p className="text-3xl font-mono bg-gray-100 p-4 rounded mb-6">{caseNumber}</p>
          <p className="text-sm text-gray-500 mb-6">
            Save this number. You will need it to track your case.
          </p>
          <Link href={`/ombudsman/track/${caseNumber}`}>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 w-full">
              {t.trackLink}
            </button>
          </Link>
          <Link href="/ombudsman">
            <button className="mt-3 text-gray-600 hover:text-gray-800 w-full">
              ← Back to Ombudsman Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Language selector */}
        <div className="bg-white rounded-t-lg p-4 border-b flex justify-end gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm rounded ${language === 'en' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('mandinka')}
            className={`px-3 py-1 text-sm rounded ${language === 'mandinka' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}
          >
            Mandinka
          </button>
          <button
            onClick={() => setLanguage('pulaar')}
            className={`px-3 py-1 text-sm rounded ${language === 'pulaar' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}
          >
            Pulaar
          </button>
        </div>

        <div className="bg-white rounded-b-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">{t.title}</h1>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Step indicator */}
          <div className="flex mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 text-center pb-2 border-b-2 ${
                  step >= s ? 'border-green-600 text-green-600' : 'border-gray-300 text-gray-400'
                }`}
              >
                {s === 1 && <span className="text-sm">{t.step1}</span>}
                {s === 2 && <span className="text-sm">{t.step2}</span>}
                {s === 3 && <span className="text-sm">{t.step3}</span>}
              </div>
            ))}
          </div>

          {/* Step 1: Complaint Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="anonymous" className="font-medium">
                  {t.anonymous}
                </label>
              </div>
              <p className="text-sm text-gray-500">{t.anonymousHelp}</p>

              {!formData.isAnonymous && (
                <>
                  <div>
                    <label className="block font-medium mb-1">{t.name}</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.complainantName}
                      onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t.phone}</label>
                    <input
                      type="tel"
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.complainantPhone}
                      onChange={(e) => setFormData({ ...formData, complainantPhone: e.target.value })}
                      placeholder="+220..."
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t.email}</label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.complainantEmail}
                      onChange={(e) => setFormData({ ...formData, complainantEmail: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-medium mb-1">{t.selectMDA}</label>
                <select
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.mdaId}
                  onChange={(e) => {
                    const selected = mdList.find((m) => m.id === e.target.value);
                    setFormData({ ...formData, mdaId: e.target.value, mdaName: selected?.name || '' });
                  }}
                >
                  <option value="">Select MDA</option>
                  {mdList.map((mda) => (
                    <option key={mda.id} value={mda.id}>
                      {mda.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">{t.complaintDetails}</label>
                <textarea
                  rows={8}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={t.complaintPlaceholder}
                  value={formData.complaintText}
                  onChange={(e) => setFormData({ ...formData, complaintText: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">{formData.complaintText.length} characters</p>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.mdaId || !formData.complaintText}
                className="w-full bg-green-600 text-white p-3 rounded font-medium disabled:opacity-50 hover:bg-green-700"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Upload Evidence */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">{t.uploadEvidence}</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full p-3 border rounded"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-sm text-gray-500 mt-1">{t.uploadHint}</p>
              </div>

              {files.length > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-2">Files to upload ({files.length}):</p>
                  <ul className="space-y-1">
                    {files.map((file, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span>
                          📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 p-3 rounded hover:bg-gray-50">
                  {t.back}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-green-600 text-white p-3 rounded hover:bg-green-700"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Review Your Complaint</h2>

              <div className="bg-gray-50 p-4 rounded space-y-3">
                <div>
                  <span className="text-sm text-gray-500">MDA:</span>
                  <p className="font-medium">{formData.mdaName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Anonymous:</span>
                  <p className="font-medium">{formData.isAnonymous ? 'Yes' : 'No'}</p>
                </div>
                {!formData.isAnonymous && (
                  <div>
                    <span className="text-sm text-gray-500">Complainant:</span>
                    <p className="font-medium">{formData.complainantName}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Complaint:</span>
                  <p className="text-sm mt-1">{formData.complaintText}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Evidence:</span>
                  <p className="font-medium">{files.length} file(s) attached</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
                By submitting this complaint, you confirm that all information provided is true to the best of
                your knowledge. False complaints may result in legal action.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 p-3 rounded hover:bg-gray-50">
                  {t.back}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || uploading}
                  className="flex-1 bg-green-600 text-white p-3 rounded disabled:opacity-50 hover:bg-green-700"
                >
                  {loading ? 'Submitting...' : uploading ? t.uploading : t.submit}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

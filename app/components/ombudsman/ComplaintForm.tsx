'use client';

import { useState } from 'react';

interface MDOption {
  id: string;
  name: string;
}

interface ComplaintFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  languages: Array<{ code: string; label: string }>;
}

const mdList: MDOption[] = [
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

export default function ComplaintForm({ onSubmit, loading, languages }: ComplaintFormProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
        <input
          type="checkbox"
          id="anonymous"
          checked={formData.isAnonymous}
          onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
          className="w-5 h-5"
        />
        <label htmlFor="anonymous" className="font-medium">
          Submit Anonymously
        </label>
      </div>

      {!formData.isAnonymous && (
        <>
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              value={formData.complainantName}
              onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              value={formData.complainantPhone}
              onChange={(e) => setFormData({ ...formData, complainantPhone: e.target.value })}
              placeholder="+220..."
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email (Optional)</label>
            <input
              type="email"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              value={formData.complainantEmail}
              onChange={(e) => setFormData({ ...formData, complainantEmail: e.target.value })}
            />
          </div>
        </>
      )}

      <div>
        <label className="block font-medium mb-1">Language</label>
        <select
          className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
          value={formData.complaintLanguage}
          onChange={(e) => setFormData({ ...formData, complaintLanguage: e.target.value })}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Ministry/Agency</label>
        <select
          required
          className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
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
        <label className="block font-medium mb-1">Complaint Details</label>
        <textarea
          rows={8}
          required
          className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
          placeholder="Describe what happened..."
          value={formData.complaintText}
          onChange={(e) => setFormData({ ...formData, complaintText: e.target.value })}
        />
        <p className="text-xs text-gray-400 mt-1">{formData.complaintText.length} characters</p>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.mdaId || !formData.complaintText}
        className="w-full bg-green-600 text-white p-3 rounded font-medium disabled:opacity-50 hover:bg-green-700"
      >
        {loading ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
}

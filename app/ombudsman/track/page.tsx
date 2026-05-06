'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TrackCaseEntryPage() {
  const router = useRouter();
  const [caseNumber, setCaseNumber] = useState('');
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = caseNumber.trim().toUpperCase();

    // Validate format: OMB-YYYY-XXXX
    const pattern = /^OMB-\d{4}-\d{4}$/;
    if (!pattern.test(trimmed)) {
      setError('Please enter a valid case number (format: OMB-YYYY-XXXX)');
      return;
    }

    router.push(`/ombudsman/track/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/ombudsman">
          <button className="text-green-700 hover:text-green-800 mb-6">← Back to Ombudsman</button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-2">Track Your Case</h1>
            <p className="text-gray-600">
              Enter your case number to check the status of your complaint.
            </p>
          </div>

          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Case Number</label>
              <input
                type="text"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 font-mono"
                placeholder="e.g., OMB-2026-0001"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                style={{ textTransform: 'uppercase' }}
              />
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!caseNumber.trim()}
              className="w-full bg-green-600 text-white p-3 rounded font-medium disabled:opacity-50 hover:bg-green-700"
            >
              Track Case
            </button>
          </form>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your case number was sent to you via SMS when you filed your complaint</li>
              <li>• Case numbers follow the format: OMB-YYYY-XXXX</li>
              <li>• Example: OMB-2026-0001</li>
              <li>• Call +220 123 4567 if you've lost your case number</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TrackCasePage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [inputCaseNumber, setInputCaseNumber] = useState(caseId || '');

  useEffect(() => {
    if (caseId) {
      fetchCase(caseId);
    } else {
      setLoading(false);
    }
  }, [caseId]);

  const fetchCase = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ombudsman/case/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCaseNumber.trim()) {
      router.push(`/ombudsman/track/${inputCaseNumber.trim()}`);
    }
  };

  const statusSteps = [
    {
      key: 'RECEIVED',
      label: 'Received',
      icon: '📮',
      description: 'Your complaint has been received and is pending review.',
    },
    {
      key: 'INVESTIGATING',
      label: 'Under Investigation',
      icon: '🔍',
      description: 'Your complaint is being reviewed by our investigation team.',
    },
    {
      key: 'MDA_RESPONDED',
      label: 'MDA Response Received',
      icon: '📨',
      description: 'The ministry/agency has responded to our inquiry.',
    },
    {
      key: 'RESOLVED',
      label: 'Resolved',
      icon: '✅',
      description: 'Your complaint has been resolved satisfactorily.',
    },
    {
      key: 'CLOSED',
      label: 'Closed',
      icon: '📁',
      description: 'Case has been closed. No further action required.',
    },
  ];

  const currentStepIndex = caseData ? statusSteps.findIndex((s) => s.key === caseData.status) : -1;

  // If no caseId in URL, show search form
  if (!caseId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/ombudsman">
            <button className="text-green-700 hover:text-green-800 mb-6">← Back to Ombudsman</button>
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-6">Track Your Case</h1>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Enter your Case Number</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., OMB-2026-0001"
                  value={inputCaseNumber}
                  onChange={(e) => setInputCaseNumber(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded font-medium hover:bg-green-700"
              >
                Track Case
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>Loading case details...</p>
        </div>
      </div>
    );

  if (notFound || !caseData)
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/ombudsman">
            <button className="text-green-700 hover:text-green-800 mb-6">← Back to Ombudsman</button>
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Case Not Found</h2>
            <p className="text-gray-600 mb-6">Please check your case number and try again.</p>
            <form onSubmit={handleTrack} className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border rounded"
                placeholder="Enter case number"
                value={inputCaseNumber}
                onChange={(e) => setInputCaseNumber(e.target.value)}
              />
              <button type="submit" className="w-full bg-green-600 text-white p-3 rounded">
                Track Case
              </button>
            </form>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/ombudsman">
          <button className="text-green-700 hover:text-green-800 mb-6">← Back to Ombudsman</button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Case Status</h1>
            <p className="text-gray-600 font-mono text-lg mt-2">{caseData.caseNumber}</p>
            <p className="text-sm text-gray-500 mt-1">
              Filed: {new Date(caseData.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Status Badge */}
          <div className="text-center mb-8">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                caseData.status === 'RESOLVED' || caseData.status === 'CLOSED'
                  ? 'bg-green-100 text-green-800'
                  : caseData.status === 'INVESTIGATING' || caseData.status === 'MDA_RESPONDED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              Status: {caseData.status}
            </span>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            {statusSteps.map((step, idx) => (
              <div key={step.key} className="flex mb-4">
                <div className="flex-shrink-0 w-12 text-center">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm ${
                      idx <= currentStepIndex ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {idx < currentStepIndex ? '✓' : step.icon}
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mx-auto mt-1 ${idx < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'}`}
                    />
                  )}
                </div>
                <div className="flex-1 ml-4 pb-4">
                  <h3 className={`font-medium ${idx <= currentStepIndex ? 'text-green-700' : 'text-gray-500'}`}>
                    {step.label}
                  </h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                  {idx === currentStepIndex && (
                    <p className="text-xs text-gray-400 mt-1">
                      Updated: {new Date(caseData.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Case Details */}
          <div className="border-t pt-4 mb-4">
            <h3 className="font-bold mb-3">Case Details</h3>
            <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
              <p>
                <strong>MDA:</strong> {caseData.mdaName}
              </p>
              <p>
                <strong>Complaint:</strong> {caseData.complaintText.substring(0, 200)}
                {caseData.complaintText.length > 200 ? '...' : ''}
              </p>
              {caseData.ujrisIntegrityScore && (
                <p>
                  <strong>Integrity Score:</strong>{' '}
                  <span
                    className={`font-mono ${
                      caseData.ujrisIntegrityScore > 70
                        ? 'text-green-600'
                        : caseData.ujrisIntegrityScore > 40
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {caseData.ujrisIntegrityScore}/100
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Recommendation Section */}
          {caseData.recommendationIssued && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold mb-2">Recommendation Issued</h3>
              <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                {caseData.recommendationText?.substring(0, 500)}...
              </div>
              {caseData.mdaResponseReceived && (
                <div className="mt-3 bg-green-50 p-3 rounded">
                  <p className="font-medium text-green-700">MDA Response Received</p>
                  <p className="text-sm mt-1">{caseData.mdaResponseText?.substring(0, 200)}...</p>
                </div>
              )}
            </div>
          )}

          {/* Download Links */}
          <div className="border-t pt-4 mt-4 flex gap-3">
            {caseData.recommendationIssued && (
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700"
              >
                📄 Print Recommendation
              </button>
            )}
            {caseData.resolvedAt && (
              <button className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700">
                📥 Download Resolution
              </button>
            )}
          </div>

          {/* Need Help */}
          <div className="border-t pt-4 mt-6 text-center text-sm text-gray-500">
            <p>Need help? Call the Ombudsman's office: +220 123 4567</p>
            <p className="mt-1">Email: ombudsman@fortisos.gov.gm</p>
          </div>
        </div>
      </div>
    </div>
  );
}

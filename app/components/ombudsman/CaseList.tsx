'use client';

import Link from 'next/link';

interface CaseItem {
  id: string;
  caseNumber: string;
  mdaName: string;
  status: string;
  ujrisIntegrityScore: number | null;
  createdAt: string;
  complainantName: string | null;
  isAnonymous: boolean;
}

interface CaseListProps {
  cases: CaseItem[];
  onStatusChange?: (caseNumber: string, status: string) => void;
}

export default function CaseList({ cases, onStatusChange }: CaseListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'INVESTIGATING':
      case 'MDA_RESPONDED':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntegrityColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score > 70) return 'text-green-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-left font-medium text-gray-600">Case #</th>
            <th className="p-3 text-left font-medium text-gray-600">Complainant</th>
            <th className="p-3 text-left font-medium text-gray-600">MDA</th>
            <th className="p-3 text-left font-medium text-gray-600">Status</th>
            <th className="p-3 text-left font-medium text-gray-600">Integrity</th>
            <th className="p-3 text-left font-medium text-gray-600">Date</th>
            <th className="p-3 text-left font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr key={caseItem.caseNumber} className="border-t hover:bg-gray-50 transition-colors">
              <td className="p-3">
                <Link
                  href={`/ombudsman/track/${caseItem.caseNumber}`}
                  className="text-blue-600 hover:underline font-mono font-medium"
                >
                  {caseItem.caseNumber}
                </Link>
              </td>
              <td className="p-3">
                {caseItem.isAnonymous ? (
                  <span className="text-gray-400 italic text-xs">Anonymous</span>
                ) : (
                  <span className="text-sm">{caseItem.complainantName || 'N/A'}</span>
                )}
              </td>
              <td className="p-3 text-sm">{caseItem.mdaName}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(caseItem.status)}`}
                >
                  {caseItem.status}
                </span>
              </td>
              <td className="p-3">
                <span className={`font-mono text-sm font-medium ${getIntegrityColor(caseItem.ujrisIntegrityScore)}`}>
                  {caseItem.ujrisIntegrityScore || '—'}
                </span>
              </td>
              <td className="p-3 text-sm text-gray-600">
                {new Date(caseItem.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                {onStatusChange && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onStatusChange(caseItem.caseNumber, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="text-xs border rounded p-1 cursor-pointer"
                  >
                    <option value="" disabled>
                      Actions...
                    </option>
                    <option value="INVESTIGATING">Mark Investigating</option>
                    <option value="RESOLVED">Mark Resolved</option>
                    <option value="CLOSED">Mark Closed</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cases.length === 0 && (
        <div className="text-center py-8 text-gray-500">No cases found.</div>
      )}
    </div>
  );
}

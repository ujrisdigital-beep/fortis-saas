'use client';

interface RecommendationLetterProps {
  recommendationText: string;
  caseNumber: string;
  mdaName: string;
  issuedAt: string;
}

export default function RecommendationLetter({
  recommendationText,
  caseNumber,
  mdaName,
  issuedAt,
}: RecommendationLetterProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([recommendationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendation-${caseNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-green-700">
        <div>
          <h2 className="text-2xl font-bold text-green-800">OFFICE OF THE OMBUDSMAN</h2>
          <p className="text-gray-600">The Gambia</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>Case: {caseNumber}</p>
          <p>Issued: {new Date(issuedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Letter Content */}
      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed mb-6 bg-gray-50 p-6 rounded border">
        {recommendationText}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handlePrint}
          className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 text-sm"
        >
          🖨️ Print Letter
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
        >
          📥 Download (.txt)
        </button>
        <button
          onClick={() => window.history.back()}
          className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50 text-sm"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

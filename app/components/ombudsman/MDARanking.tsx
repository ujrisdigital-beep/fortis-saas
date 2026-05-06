'use client';

interface MDARankingItem {
  mda: string;
  mdaId: string;
  totalComplaints: number;
  resolved: number;
  complianceRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface MDARankingProps {
  data: MDARankingItem[];
}

export default function MDARanking({ data }: MDARankingProps) {
  // Sort by total complaints descending
  const sortedData = [...data].sort((a, b) => b.totalComplaints - a.totalComplaints);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-red-500" title="Complaints increasing">↑</span>;
      case 'down':
        return <span className="text-green-500" title="Complaints decreasing">↓</span>;
      default:
        return <span className="text-gray-400" title="Stable">→</span>;
    }
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-bold text-lg mb-4">MDA Complaint Ranking</h3>

      <div className="space-y-3">
        {sortedData.map((item, idx) => (
          <div key={item.mdaId} className="flex items-center p-3 hover:bg-gray-50 rounded">
            {/* Rank */}
            <div className="w-8 text-center">
              <span
                className={`font-bold text-sm ${
                  idx === 0
                    ? 'text-red-600'
                    : idx === 1
                      ? 'text-orange-600'
                      : idx === 2
                        ? 'text-yellow-600'
                        : 'text-gray-400'
                }`}
              >
                {idx + 1}
              </span>
            </div>

            {/* MDA Name */}
            <div className="flex-1 ml-3">
              <p className="font-medium text-sm">{item.mda}</p>
              <div className="flex gap-4 mt-1 text-xs text-gray-500">
                <span>{item.totalComplaints} complaints</span>
                <span>{item.resolved} resolved</span>
              </div>
            </div>

            {/* Compliance Rate */}
            <div className="text-right">
              <p className={`font-mono text-sm font-bold ${getComplianceColor(item.complianceRate)}`}>
                {item.complianceRate}%
              </p>
              <div className="text-lg">{getTrendIcon(item.trend)}</div>
            </div>
          </div>
        ))}
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data available.</div>
      )}
    </div>
  );
}

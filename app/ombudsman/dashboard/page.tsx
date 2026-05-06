'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Case {
  id: string;
  caseNumber: string;
  mdaName: string;
  status: string;
  ujrisIntegrityScore: number | null;
  createdAt: string;
  complainantName: string | null;
  isAnonymous: boolean;
  recommendationIssued: boolean;
}

interface DashboardData {
  summary: {
    totalCases: number;
    received: number;
    investigating: number;
    resolved: number;
    closed: number;
    avgResolutionDays: number;
    complianceRate: number;
    citizenSatisfactionAvg: number;
  };
  complaintsByMDA: Array<{
    mda: string;
    mdaId: string;
    totalComplaints: number;
    resolved: number;
    complianceRate: number;
    trend: string;
  }>;
  integrityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  recentCases: Case[];
}

export default function OmbudsmanDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchCases();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/ombudsman/dashboard');
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/ombudsman/cases');
      const data = await res.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCaseStatus = async (caseNumber: string, status: string) => {
    try {
      await fetch(`/api/ombudsman/case/${caseNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, performedBy: 'investigator' }),
      });
      fetchCases();
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const generateRecommendation = async (caseNumber: string) => {
    try {
      await fetch('/api/ombudsman/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseNumber, performedBy: 'investigator' }),
      });
      fetchCases();
      fetchDashboardData();
    } catch (error) {
      console.error('Error generating recommendation:', error);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(search) ||
        c.mdaName.toLowerCase().includes(search) ||
        (!c.isAnonymous && c.complainantName?.toLowerCase().includes(search))
      );
    }
    return true;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Ombudsman Dashboard</h1>
            <p className="text-sm opacity-90">Monitor complaints, track MDA compliance, and manage cases</p>
          </div>
          <Link href="/ombudsman">
            <button className="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-100">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-3xl font-bold text-gray-800">{dashboardData?.summary.totalCases || 0}</div>
            <div className="text-gray-600 text-sm">Total Cases</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded shadow">
            <div className="text-3xl font-bold text-yellow-700">{dashboardData?.summary.received || 0}</div>
            <div className="text-gray-600 text-sm">New (Received)</div>
          </div>
          <div className="bg-blue-50 p-4 rounded shadow">
            <div className="text-3xl font-bold text-blue-700">{dashboardData?.summary.investigating || 0}</div>
            <div className="text-gray-600 text-sm">Investigating</div>
          </div>
          <div className="bg-green-50 p-4 rounded shadow">
            <div className="text-3xl font-bold text-green-700">{dashboardData?.summary.resolved || 0}</div>
            <div className="text-gray-600 text-sm">Resolved</div>
          </div>
          <div className="bg-purple-50 p-4 rounded shadow">
            <div className="text-3xl font-bold text-purple-700">
              {dashboardData?.summary.complianceRate || 0}%
            </div>
            <div className="text-gray-600 text-sm">MDA Compliance</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500 mb-1">Avg. Resolution Time</div>
            <div className="text-2xl font-bold">{dashboardData?.summary.avgResolutionDays || 0} days</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500 mb-1">Citizen Satisfaction</div>
            <div className="text-2xl font-bold">
              {dashboardData?.summary.citizenSatisfactionAvg || 0}/5
            </div>
          </div>
        </div>

        {/* Integrity Distribution */}
        <div className="bg-white rounded shadow mb-6 p-4">
          <h2 className="font-bold text-lg mb-4">Case Integrity Distribution (UJRIS)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded text-center">
              <div className="text-2xl font-bold text-green-700">
                {dashboardData?.integrityDistribution.high || 0}
              </div>
              <div className="text-sm text-gray-600">High Integrity (70-100)</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded text-center">
              <div className="text-2xl font-bold text-yellow-700">
                {dashboardData?.integrityDistribution.medium || 0}
              </div>
              <div className="text-sm text-gray-600">Medium Integrity (40-69)</div>
            </div>
            <div className="bg-red-50 p-3 rounded text-center">
              <div className="text-2xl font-bold text-red-700">
                {dashboardData?.integrityDistribution.low || 0}
              </div>
              <div className="text-sm text-gray-600">Low Integrity (0-39)</div>
            </div>
          </div>
        </div>

        {/* Complaints by MDA */}
        <div className="bg-white rounded shadow mb-6 p-4">
          <h2 className="font-bold text-lg mb-4">Complaints by Ministry/Agency</h2>
          <div className="space-y-3">
            {dashboardData?.complaintsByMDA.map((item) => (
              <div key={item.mda} className="flex items-center">
                <div className="w-1/3 text-sm font-medium truncate pr-2">{item.mda}</div>
                <div className="w-2/3 bg-gray-200 rounded h-8 relative">
                  <div
                    className="bg-red-500 h-8 rounded text-white text-xs flex items-center pl-2 font-medium"
                    style={{
                      width: `${Math.min(100, (item.totalComplaints / (dashboardData?.summary.totalCases || 1)) * 100)}%`,
                      minWidth: '40px',
                    }}
                  >
                    {item.totalComplaints} cases
                  </div>
                </div>
                <div className="ml-2">
                  {item.trend === 'up' && <span className="text-red-500 text-xs">↑</span>}
                  {item.trend === 'down' && <span className="text-green-500 text-xs">↓</span>}
                  {item.trend === 'stable' && <span className="text-gray-400 text-xs">→</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded shadow mb-6 p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by case number, MDA, or complainant..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="p-2 border rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="RECEIVED">Received</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="MDA_RESPONDED">MDA Responded</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <h2 className="font-bold text-lg mb-4">All Cases ({filteredCases.length})</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Case #</th>
                <th className="p-3 text-left">Complainant</th>
                <th className="p-3 text-left">MDA</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Integrity</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caseItem) => (
                <tr key={caseItem.caseNumber} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Link
                      href={`/ombudsman/track/${caseItem.caseNumber}`}
                      className="text-blue-600 hover:underline font-mono"
                    >
                      {caseItem.caseNumber}
                    </Link>
                  </td>
                  <td className="p-3">
                    {caseItem.isAnonymous ? (
                      <span className="text-gray-400 italic">Anonymous</span>
                    ) : (
                      caseItem.complainantName || 'N/A'
                    )}
                  </td>
                  <td className="p-3">{caseItem.mdaName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        caseItem.status === 'RECEIVED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : caseItem.status === 'INVESTIGATING' || caseItem.status === 'MDA_RESPONDED'
                            ? 'bg-blue-100 text-blue-800'
                            : caseItem.status === 'RESOLVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-mono text-sm font-medium ${
                        (caseItem.ujrisIntegrityScore || 0) > 70
                          ? 'text-green-600'
                          : (caseItem.ujrisIntegrityScore || 0) > 40
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {caseItem.ujrisIntegrityScore || '—'}
                    </span>
                  </td>
                  <td className="p-3">{new Date(caseItem.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            updateCaseStatus(caseItem.caseNumber, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="text-xs border rounded p-1"
                      >
                        <option value="" disabled>
                          Change Status
                        </option>
                        <option value="RECEIVED">Received</option>
                        <option value="INVESTIGATING">Investigating</option>
                        <option value="MDA_RESPONDED">MDA Responded</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      {!caseItem.recommendationIssued && (
                        <button
                          onClick={() => generateRecommendation(caseItem.caseNumber)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Recommend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="text-center py-8 text-gray-500">No cases found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}

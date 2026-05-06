'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function OmbudsmanPage() {
  const [language, setLanguage] = useState('en');
  const [stats, setStats] = useState({
    totalCases: 150,
    avgResolutionDays: 21,
    citizenSatisfaction: 85,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/ombudsman/dashboard');
      const data = await res.json();
      if (data.summary) {
        setStats({
          totalCases: data.summary.totalCases || 150,
          avgResolutionDays: data.summary.avgResolutionDays || 21,
          citizenSatisfaction: data.summary.complianceRate || 85,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const content = {
    en: {
      title: 'Office of the Ombudsman',
      subtitle: 'Protecting Your Rights. Ensuring Fairness. Delivering Justice.',
      description:
        'If a government ministry, department, or agency has treated you unfairly — dismissed you without cause, withheld your pay, or ignored your complaint — we are here to help.',
      fileComplaint: 'File a Complaint',
      trackCase: 'Track Your Case',
      knowYourRights: 'Know Your Rights',
      stats: {
        resolved: 'Cases Resolved',
        avgTime: 'Avg. Resolution Time',
        satisfaction: 'Citizen Satisfaction',
      },
      heroText: {
        cta: 'Your voice matters. Justice is within reach.',
        subtext: 'The Ombudsman investigates complaints against government agencies and ensures administrative justice for all Gambians.',
      },
    },
    mandinka: {
      title: 'Ombudsman Kantigi',
      subtitle: 'I la hakili kana. Tilifaroo. Kitaa soto.',
      description:
        'Ni Banku kuntolaa, minisitaa, laa le ka i lafaara tilifaroo la — i bondita kaŋo la, i la saritaa sotooma, i la kumakaŋo dondoma — nte le be jee i ye dankaŋo la.',
      fileComplaint: 'Kumakaŋo Dondoma',
      trackCase: 'I la Mootoo Jaakiroo',
      knowYourRights: 'I la Hakaa Lɔŋ',
      stats: {
        resolved: 'Mootoolu Kitaama',
        avgTime: 'Hakukeŋo Waatoo',
        satisfaction: 'Jamaa Maraloo',
      },
      heroText: {
        cta: 'I la dankaroo le. Kitaa mu i la koŋoŋo.',
        subtext: 'Ombudsman be banku kuntolaa laa le koŋoŋo jaakiroo la, nte be kitaa soto jamaa baama.',
      },
    },
    pulaar: {
      title: 'Ofis Ombudsman',
      subtitle: 'Dagɗino Haaƴe Ma. Nanaare. Nuunɗam.',
      description:
        'Si laawol laamu, ministeer, walla fedde laamu waɗii maa nekki — cuɓaama e golle, miniraa njoddi ma, walla ronkii jaabelgo maake — min njaha balloo maa.',
      fileComplaint: 'Petto Nekka',
      trackCase: 'Luttoo Koore Ma',
      knowYourRights: 'Anndu Hakkeeji Ma',
      stats: {
        resolved: 'Koore Njaɓaaɗe',
        avgTime: 'Wakkati Hajjugo',
        satisfaction: 'Jamaa Jaabel',
      },
      heroText: {
        cta: 'Dagɗal maa no woodi haɗe. Nuunɗam no heddii maa.',
        subtext: 'Ombudsman jaɓta kooreeji njiinirɗi e laawol laamu, o hoolnira nanaare defte fof banndiraaɓe.',
      },
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Selector */}
      <div className="bg-white border-b p-4 flex justify-end gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded ${language === 'en' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'}`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('mandinka')}
          className={`px-3 py-1 rounded ${language === 'mandinka' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'}`}
        >
          Mandinka
        </button>
        <button
          onClick={() => setLanguage('pulaar')}
          className={`px-3 py-1 rounded ${language === 'pulaar' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'}`}
        >
          Pulaar
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 text-6xl">⚖️</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl md:text-2xl mb-6">{t.subtitle}</p>
          <p className="text-lg max-w-2xl mx-auto mb-8">{t.description}</p>
          <p className="text-lg font-medium italic mb-4">{t.heroText.cta}</p>
          <p className="text-md opacity-90">{t.heroText.subtext}</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/ombudsman/complain">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{t.fileComplaint}</h3>
              <p className="text-gray-600">Anonymous. In your language. From your phone.</p>
            </div>
          </Link>

          <Link href="/ombudsman/track">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{t.trackCase}</h3>
              <p className="text-gray-600">Check your case status anytime, anywhere.</p>
            </div>
          </Link>

          <Link href="/ombudsman/rights">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{t.knowYourRights}</h3>
              <p className="text-gray-600">Learn your rights under Gambian law.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl font-bold text-green-700">{stats.totalCases}+</div>
              <div className="text-gray-600 mt-2">{t.stats.resolved}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl font-bold text-green-700">{stats.avgResolutionDays}</div>
              <div className="text-gray-600 mt-2">{t.stats.avgTime} (days)</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl font-bold text-green-700">{stats.citizenSatisfaction}%</div>
              <div className="text-gray-600 mt-2">{t.stats.satisfaction}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-2">Office of the Ombudsman, The Gambia</p>
          <p className="text-sm text-gray-400">Phone: +220 123 4567 | Email: ombudsman@fortisos.gov.gm</p>
        </div>
      </div>
    </div>
  );
}

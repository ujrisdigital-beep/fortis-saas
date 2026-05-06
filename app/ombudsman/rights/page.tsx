'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function KnowYourRightsPage() {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Know Your Rights',
      subtitle: 'Understanding the Labour Act 2007 and Your Protections',
      intro:
        'The Gambia Labour Act 2007 provides important protections for all workers. Here are your key rights:',
      rights: [
        {
          title: 'Right to Fair Dismissal',
          icon: '⚖️',
          description:
            'You cannot be dismissed without notice or fair hearing. The employer must provide written notice and a valid reason.',
          law: 'Labour Act 2007, Section 65-67',
        },
        {
          title: 'Right to Severance Pay',
          icon: '💰',
          description:
            'If you are unfairly dismissed, you may be entitled to severance pay based on your years of service.',
          law: 'Labour Act 2007, Section 66',
        },
        {
          title: 'Right to Be Heard',
          icon: '📢',
          description:
            'Before any adverse action is taken against you, you have the right to present your side of the story.',
          law: 'Labour Act 2007, Section 68',
        },
        {
          title: 'Right to Timely Payment',
          icon: '⏰',
          description:
            'Your employer must pay your wages on time and cannot make unauthorized deductions from your salary.',
          law: 'Labour Act 2007, Section 80-81',
        },
        {
          title: 'Protection from Discrimination',
          icon: '🛡️',
          description:
            'You cannot be discriminated against based on tribe, religion, gender, or political affiliation.',
          law: 'Constitution 1997, Section 28',
        },
        {
          title: 'Right to Certificate of Service',
          icon: '📜',
          description:
            'Upon termination, you are entitled to receive a certificate of service detailing your employment history.',
          law: 'Labour Act 2007, Section 70',
        },
      ],
      ombudsmanTitle: 'How the Ombudsman Can Help',
      ombudsmanText:
        'The Office of the Ombudsman investigates complaints against government ministries, departments, and agencies. We can help when:',
      situations: [
        'You were unfairly dismissed from a government job',
        'Your salary or benefits were withheld',
        'You were denied a promotion due to discrimination',
        'You reported corruption and faced retaliation',
        "You weren't given a fair hearing before adverse action",
      ],
      cta: 'File a Complaint Now',
      footer: 'Remember: Justice delayed is justice denied. Act now.',
    },
    mandinka: {
      title: 'I la Hakaa Lɔŋ',
      subtitle: 'Labour Act 2007 I la tiimoo laŋŋiroo',
      intro: 'Gambia Labour Act 2007 soŋta jamaa baama la tiimoo tɔɔ. I la hakili tɔɔ le:',
      rights: [
        {
          title: 'Hakili tɔɔ baa bonditaa la',
          icon: '⚖️',
          description: 'I seŋ bonditaa la tɛŋo la, walla i seŋ haaloo tɛŋo. Kono laa le i ye haaloo tɛŋo la.',
          law: 'Labour Act 2007, Section 65-67',
        },
        {
          title: 'Saritaa Baa Dɔɔriroo',
          icon: '💰',
          description: 'Ni i la toŋo bonditaama, i bɛnɛ saritaa dɔɔriroo i la tooŋo le.',
          law: 'Labour Act 2007, Section 66',
        },
        {
          title: 'Hakili tɔɔ i bɛnɛ haaloo',
          icon: '📢',
          description: 'I la toŋo meŋ le nyɛma i ye, i bɛnɛ i la haaloo bɛ tabilo.',
          law: 'Labour Act 2007, Section 68',
        },
        {
          title: 'Hakili tɔɔ saritaa yomma taa',
          icon: '⏰',
          description: 'I la kono le i la saritaa yomma taa, a seŋ i la saritaa la too.',
          law: 'Labour Act 2007, Section 80-81',
        },
        {
          title: 'Tiimoo tɛŋo laamaa',
          icon: '🛡️',
          description: 'I seŋ tiimoo tɛŋo laamaa bɛ too ni i la toŋo, i la deenoo, walla i la politiki.',
          law: 'Constitution 1997, Section 28',
        },
        {
          title: 'Hakili tɔɔ saritaa leetari',
          icon: '📜',
          description: 'Ni i la toŋo kitaama, i bɛnɛ saritaa leetari i la tooŋo la koŋoŋo.',
          law: 'Labour Act 2007, Section 70',
        },
      ],
      ombudsmanTitle: 'Ombudsman le moo ye jee i ye',
      ombudsmanText: 'Ombudsman Kantigi be banku kuntolaa, minisitaa, laa le koŋoŋo jaakiroo la. Nte be jee i ye ni:',
      situations: [
        'I la toŋo banku le bonitaama la',
        'I la saritaa too maa dabbaama',
        'I la boni dɔɔriroo koto maa laamaa le',
        'I laamaa korosipiroo le, i la toŋo bonitaama',
        "I la haaloo too maa dabbaama, i bɛnɛ i la toŋo tɛŋo la",
      ],
      cta: 'Kumakaŋo Dondoma',
      footer: 'Hakili tɔɔ le: Kitaa yaŋuma, kitaa tooŋo le.',
    },
    pulaar: {
      title: 'Anndu Hakkeeji Ma',
      subtitle: 'Hakkuge Labour Act 2007 e jokke maa',
      intro: 'Gambia Labour Act 2007 ɗo hakkeeji lobbo ɗi moƴƴa banndiraaɓe fof. Kayde ɗe ɗe:',
      rights: [
        {
          title: 'Hakkugal nekka e nanaare',
          icon: '⚖️',
          description: 'A onaa haani teddude e nder haalaaji baaɗi. Golle maaɗo haani e sertaaɗo e ɗum waɗi innde.',
          law: 'Labour Act 2007, Section 65-67',
        },
        {
          title: 'Hakkugal mbaadi teddeendi',
          icon: '💰',
          description: 'So a nekkaama e golle juutiri, a woodi hakkugal mbaadi teddeendi ngam ɗum waɗi e duuɓi maa.',
          law: 'Labour Act 2007, Section 66',
        },
        {
          title: 'Hakkugal haalde maa',
          icon: '📢',
          description: 'Fuɗɗude golle juutaaɗe waɗɗe e hoore maa, a woodi hakkugal tiiɗde koɗum waɗi.',
          law: 'Labour Act 2007, Section 68',
        },
        {
          title: 'Hakkugal njoɓnude e wakkati',
          icon: '⏰',
          description: 'Golle maaɗo haani njoɓnude maa e wakkati, o onaa haani yankondude e nder njoɓdi maa.',
          law: 'Labour Act 2007, Section 80-81',
        },
        {
          title: 'Dagɗinol e nder laamaagal',
          icon: '🛡️',
          description: 'A onaa waawi dagɗineede ngam renndo, diina, worɓe/debbo, wolla politiki maa.',
          law: 'Constitution 1997, Section 28',
        },
        {
          title: 'Hakkugal seedangal golle',
          icon: '📜',
          description: 'So golle maaɗum accata, a woodi hakkugal seedangal golle ngam ɗum anndira duuɓi maa.',
          law: 'Labour Act 2007, Section 70',
        },
      ],
      ombudsmanTitle: 'Hono Ombudsman Moo Yiilta Maa',
      ombudsmanText:
        'Ofis Ombudsman jottii kooreeji njiinirɗi e laawol laamu, ministeer, e fedde laamu. Min mbaɗata moƴƴugo so:',
      situations: [
        'A nekkaama e golle laawol laamu ko nanaa',
        'Njoɓdi maa walla ngeendu maa ronkaama',
        'A dawaa dɔɔrire ngeendu ngam laamaagal',
        'A jottii koore korosiwol, a njaltinaama',
        "A hoolaaki e nanaare fuɗɗude haalde maa ko haani",
      ],
      cta: 'Petto Nekka Jooni',
      footer: 'Hakkil: Nuunɗam loowi ko hettii, nuunɗam nyiɓaa.',
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/ombudsman">
          <button className="text-green-700 hover:text-green-800 mb-6">← Back to Ombudsman</button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-8">{t.subtitle}</p>

          <p className="mb-6 text-gray-700">{t.intro}</p>

          {/* Rights Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {t.rights.map((right, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{right.icon}</span>
                  <div>
                    <h3 className="font-bold text-green-800 mb-1">{right.title}</h3>
                    <p className="text-sm text-gray-600">{right.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{right.law}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ombudsman Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-3">{t.ombudsmanTitle}</h2>
            <p className="mb-4 text-gray-700">{t.ombudsmanText}</p>
            <ul className="space-y-2">
              {t.situations.map((situation, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">{situation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/ombudsman/complain">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700">
                {t.cta}
              </button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 italic">{t.footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

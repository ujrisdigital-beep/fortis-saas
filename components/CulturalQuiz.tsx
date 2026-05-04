'use client'
import { useState } from 'react'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

type Question = {
  q: string
  options: string[]
  answer: number
  explanation: string
}

const QUESTIONS: Question[] = [
  {
    q: 'What is The Gambia\'s national dish?',
    options: ['Benachin', 'Yassa', 'Domoda', 'Superkanja'],
    answer: 2,
    explanation: 'Domoda is a rich groundnut (peanut butter) stew considered the national dish of The Gambia, served over steamed white rice.',
  },
  {
    q: 'Which Gambian masquerade is inscribed on the UNESCO Intangible Cultural Heritage list?',
    options: ['Kumpo', 'Zimba', 'Kankurang', 'Sewruba'],
    answer: 2,
    explanation: 'The Kankurang is a Mandinka masquerade inscribed on UNESCO\'s Intangible Cultural Heritage list since 2005. It represents justice and protection.',
  },
  {
    q: 'How many strings does a traditional kora have?',
    options: ['12', '17', '21', '28'],
    answer: 2,
    explanation: 'The kora is a 21-string harp-lute, one of West Africa\'s most complex instruments. It is played by griots (jalis) and is deeply associated with Gambian and Senegambian musical culture.',
  },
  {
    q: 'What is the Mandinka term for the hereditary musician-historian tradition?',
    options: ['Jaliya', 'Bugarabu', 'Kankurang', 'Borreh'],
    answer: 0,
    explanation: 'Jaliya is the Mandinka word for the griot tradition — encompassing hereditary musicians, historians, and praise-singers who preserve oral history through music.',
  },
  {
    q: 'Which ethnic group performs the Kumpo masquerade?',
    options: ['Mandinka', 'Wolof', 'Fula', 'Jola'],
    answer: 3,
    explanation: 'The Kumpo is a Jola masquerade featuring a wild grass-covered figure that twirls and dances. The Jola people are known for their strong traditional spiritual beliefs.',
  },
  {
    q: 'What is the name of The Gambia\'s traditional national sport?',
    options: ['Wari', 'Borreh', 'Birimintingo', 'Dundun'],
    answer: 1,
    explanation: 'Borreh is traditional Gambian wrestling — the national sport. Wrestlers compete with griot praise-singing and drumming, and it is central to Gambian cultural identity.',
  },
  {
    q: 'Which famous griot is known as the "King of Kora"?',
    options: ['Bai Konte', 'Foday Musa Suso', 'Sona Jobarteh', 'Jaliba Kuyateh'],
    answer: 3,
    explanation: 'Jaliba Kuyateh is widely celebrated as the "King of Kora" — one of the most beloved Gambian musicians whose performances draw huge crowds across The Gambia.',
  },
  {
    q: 'What is the Sunjata Epic?',
    options: [
      'A Jola drumming rhythm',
      'A founding story of The Gambia',
      'The oral epic of Sunjata Keita, founder of the Mali Empire',
      'A wrestling tournament held annually in Banjul',
    ],
    answer: 2,
    explanation: 'The Sunjata Epic is one of West Africa\'s greatest oral epics — telling the story of Sunjata Keita who overcame disability to found the Mali Empire. It is preserved by Gambian griots.',
  },
  {
    q: 'Which instrument is associated with the Wolof people and played with a stick?',
    options: ['Bougarabou', 'Sabar', 'Djembe', 'Dundun'],
    answer: 1,
    explanation: 'The Sabar is a Wolof drum played with one hand and one stick. It is central to Wolof ceremonies and celebrations and requires extraordinary technical skill.',
  },
  {
    q: 'What does the Gambian proverb "An empty bag cannot stand" mean?',
    options: [
      'Bags should always be stored upright',
      'A person without resources or support cannot sustain themselves',
      'You should save money before spending',
      'Empty words have no weight',
    ],
    answer: 1,
    explanation: 'This Mandinka proverb means that a person — like an empty bag — cannot stand on their own without resources, support, or substance. It speaks to the importance of preparation and community.',
  },
]

type Phase = 'intro' | 'quiz' | 'result'

export default function CulturalQuiz() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))

  function start() {
    setPhase('quiz')
    setQIdx(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setAnswers(Array(QUESTIONS.length).fill(null))
  }

  function choose(i: number) {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    if (i === QUESTIONS[qIdx].answer) setScore(s => s + 1)
    setAnswers(prev => { const next = [...prev]; next[qIdx] = i; return next })
  }

  function next() {
    if (qIdx + 1 >= QUESTIONS.length) {
      setPhase('result')
    } else {
      setQIdx(q => q + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const q = QUESTIONS[qIdx]
  const pct = Math.round((score / QUESTIONS.length) * 100)
  const grade = pct >= 80 ? { label: 'Cultural Expert', color: GOLD, icon: '🏆' }
    : pct >= 60 ? { label: 'Cultural Scholar', color: G, icon: '📚' }
    : pct >= 40 ? { label: 'Cultural Explorer', color: '#0C7B7A', icon: '🌍' }
    : { label: 'Cultural Apprentice', color: '#6b7280', icon: '🌱' }

  if (phase === 'intro') return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: '0.75rem' }}>🇬🇲</div>
      <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 800, color: DARK, margin: '0 0 0.5rem' }}>
        Gambian Culture Quiz
      </h2>
      <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
        Test your knowledge of Gambian heritage — music, food, traditions, masquerades, proverbs and more. 10 questions.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[['10', 'Questions'], ['5', 'Topics'], ['🥜', 'Culture']].map(([v, l]) => (
          <div key={l} style={{ background: '#f9fafb', borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 70 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: G }}>{v}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{l}</div>
          </div>
        ))}
      </div>
      <button onClick={start} style={{ background: G, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
        Start Quiz →
      </button>
    </div>
  )

  if (phase === 'result') return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: '0.5rem' }}>{grade.icon}</div>
      <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', fontWeight: 800, color: DARK, margin: '0 0 0.25rem' }}>
        {grade.label}
      </h2>
      <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: grade.color, margin: '0.5rem 0' }}>
        {score}/{QUESTIONS.length}
      </div>
      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 1.5rem' }}>{pct}% correct</p>

      {/* Answer Review */}
      <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        {QUESTIONS.map((q, i) => {
          const correct = answers[i] === q.answer
          return (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{correct ? '✅' : '❌'}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{q.q}</div>
                {!correct && (
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                    Answer: <span style={{ fontWeight: 600, color: G }}>{q.options[q.answer]}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={start} style={{ background: G, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
        🔄 Retake Quiz
      </button>
    </div>
  )

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', padding: '1.5rem' }}>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>Question {qIdx + 1} of {QUESTIONS.length}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: G }}>Score: {score}</span>
      </div>
      <div style={{ height: 4, background: '#f3f4f6', borderRadius: 999, marginBottom: '1.25rem' }}>
        <div style={{ height: 4, background: G, borderRadius: 999, width: `${((qIdx) / QUESTIONS.length) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* Question */}
      <h3 style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', fontWeight: 800, color: DARK, margin: '0 0 1.25rem', lineHeight: 1.4 }}>
        {q.q}
      </h3>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.25rem' }}>
        {q.options.map((opt, i) => {
          let bg = '#f9fafb'
          let border = '1.5px solid #e5e7eb'
          let color = '#374151'
          if (revealed) {
            if (i === q.answer) { bg = '#dcfce7'; border = `1.5px solid ${G}`; color = DARK }
            else if (i === selected && i !== q.answer) { bg = '#fee2e2'; border = '1.5px solid #ef4444'; color = '#991b1b' }
          } else if (selected === i) {
            bg = '#eff6ff'; border = '1.5px solid #3b82f6'
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              style={{ background: bg, border, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600, color, textAlign: 'left', cursor: revealed ? 'default' : 'pointer', transition: 'all 0.15s' }}
            >
              <span style={{ fontWeight: 800, marginRight: 8 }}>{['A', 'B', 'C', 'D'][i]}.</span>
              {opt}
              {revealed && i === q.answer && <span style={{ marginLeft: 8 }}>✓</span>}
              {revealed && i === selected && i !== q.answer && <span style={{ marginLeft: 8 }}>✗</span>}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div style={{ background: '#f0fdf4', border: `1.5px solid ${G}`, borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: G }}>💡 </span>
          <span style={{ fontSize: 12, color: DARK }}>{q.explanation}</span>
        </div>
      )}

      <button
        onClick={next}
        disabled={!revealed}
        style={{
          background: revealed ? G : '#e5e7eb',
          color: revealed ? '#fff' : '#9ca3af',
          border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 800,
          cursor: revealed ? 'pointer' : 'not-allowed', width: '100%',
        }}
      >
        {qIdx + 1 >= QUESTIONS.length ? 'See Results →' : 'Next Question →'}
      </button>
    </div>
  )
}

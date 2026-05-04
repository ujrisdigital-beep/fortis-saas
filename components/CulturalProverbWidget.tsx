'use client'
import { useState, useEffect } from 'react'

const G = '#1B4D3E'
const GOLD = '#C4943A'

const PROVERBS = [
  { text: 'An empty bag cannot stand.', language: 'Mandinka', meaning: 'A person without resources or support cannot sustain themselves.' },
  { text: 'The forest would be silent if no bird sang except the one that sang best.', language: 'Mandinka', meaning: 'Everyone has a contribution to make, however small.' },
  { text: 'Knowledge is like a garden: if it is not cultivated, it cannot be harvested.', language: 'Mandinka', meaning: 'Learning requires continuous effort and care.' },
  { text: 'A child who is not embraced by the village will burn it down to feel its warmth.', language: 'Wolof', meaning: 'Community must nurture its youth or face consequences.' },
  { text: 'However long the night, the dawn will break.', language: 'Fula', meaning: 'Hardship is always temporary; hope endures.' },
  { text: 'Rain does not fall on one roof alone.', language: 'Mandinka', meaning: 'Trouble is shared among all; community bonds us together.' },
  { text: 'Until the lion learns to write, every story will glorify the hunter.', language: 'Wolof', meaning: 'Those without a voice must learn to tell their own story.' },
  { text: 'A tree is straightened while it is young.', language: 'Mandinka', meaning: 'Children must be guided early; old habits are hard to change.' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', language: 'Fula', meaning: 'Collective effort achieves greater goals than individual speed.' },
  { text: 'The earth is a beehive; we all enter by the same door.', language: 'Wolof', meaning: 'All people share the same origin and destiny.' },
  { text: 'A patient person will eat ripe fruit.', language: 'Mandinka', meaning: 'Good things come to those who wait with wisdom.' },
  { text: 'Not everyone who chased the zebra caught it, but he who caught it, chased it.', language: 'Wolof', meaning: 'Persistence is the path to achievement.' },
  { text: 'When the music changes, so does the dance.', language: 'Fula', meaning: 'Adaptability is essential; respond wisely to changing circumstances.' },
  { text: 'He who learns, teaches.', language: 'Mandinka', meaning: 'Knowledge passed on multiplies its value.' },
  { text: 'A river that forgets its source will dry up.', language: 'Wolof', meaning: 'Losing connection with your heritage leads to ruin.' },
  { text: 'The wise do not sit and wait for food; they go and find it.', language: 'Mandinka', meaning: 'Initiative and action are the foundations of prosperity.' },
  { text: 'Even the mightiest eagle must land.', language: 'Fula', meaning: 'No matter how powerful, every person needs rest and humility.' },
  { text: 'A family is like a forest — when you stand outside it is dense; when you stand inside you see each tree has its own place.', language: 'Mandinka', meaning: 'Family may appear unified from outside, yet each member has their distinct role.' },
  { text: 'Do not look where you fell, but where you slipped.', language: 'Wolof', meaning: 'Seek the root cause of problems, not just their effects.' },
  { text: 'Speak softly and carry a big heart.', language: 'Fula', meaning: 'Compassion and gentleness are greater strengths than force.' },
  { text: 'The axe forgets, but the tree remembers.', language: 'Mandinka', meaning: 'Those who cause harm often forget, while those harmed carry it long after.' },
  { text: 'You cannot shave a man\'s head in his absence.', language: 'Wolof', meaning: 'Decisions affecting someone must involve that person.' },
]

export default function CulturalProverbWidget() {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    setIdx(Math.floor(Math.random() * PROVERBS.length))
  }, [])

  function next() {
    setFade(false)
    setTimeout(() => {
      setIdx(i => (i + 1) % PROVERBS.length)
      setFade(true)
    }, 200)
  }

  function random() {
    setFade(false)
    setTimeout(() => {
      setIdx(Math.floor(Math.random() * PROVERBS.length))
      setFade(true)
    }, 200)
  }

  const p = PROVERBS[idx]

  return (
    <div style={{
      background: `linear-gradient(135deg, ${G} 0%, #2A6B52 100%)`,
      borderRadius: 16,
      padding: '1.5rem 1.75rem',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.07, lineHeight: 1 }}>❝</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        Proverb of the Day — {p.language}
      </div>
      <p style={{
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        fontWeight: 700,
        lineHeight: 1.5,
        margin: '0 0 0.75rem',
        fontStyle: 'italic',
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        ❝ {p.text} ❞
      </p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 1.25rem', opacity: fade ? 1 : 0, transition: 'opacity 0.2s ease' }}>
        {p.meaning}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={random} style={{ background: GOLD, color: '#0F3D21', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          🎲 Random
        </button>
        <button onClick={next} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Next →
        </button>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', alignSelf: 'center', marginLeft: 4 }}>
          {idx + 1}/{PROVERBS.length}
        </span>
      </div>
    </div>
  )
}

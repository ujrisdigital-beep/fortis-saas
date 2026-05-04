'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  variant?: 'full' | 'icon' | 'mobile'
  href?: string
  white?: boolean
}

export default function FortisLogo({ variant = 'full', href = '/', white = false }: Props) {
  const [imageExists, setImageExists] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
    img.src = '/images/fortis-logo.png';
  }, []);

  const size = variant === 'mobile' ? 32 : 40;

  const Badge = imageExists ? (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      borderRadius: variant === 'mobile' ? 8 : 10,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <img 
        src="/images/fortis-logo.png" 
        alt="FORTIS" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  ) : (
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #1B4D3E 0%, #C4943A 100%)',
      borderRadius: variant === 'mobile' ? 8 : 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 900,
      fontSize: variant === 'mobile' ? 15 : 18,
      color: '#fff',
      letterSpacing: '-1px',
      flexShrink: 0,
    }}>
      FI
    </div>
  );

  if (variant === 'icon') return Badge;

  const Text = (
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontWeight: 800, fontSize: variant === 'mobile' ? '0.85rem' : '0.95rem', color: white ? '#fff' : '#0F3D21', letterSpacing: '-0.02em' }}>
        FORTIS INVICTA
      </div>
      <div style={{ fontSize: '0.6rem', color: '#C4943A', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' }}>
        FORTIS OS™
      </div>
    </div>
  );

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: variant === 'mobile' ? 6 : 9 }}>
        {Badge}
        {Text}
      </div>
    </Link>
  );
}
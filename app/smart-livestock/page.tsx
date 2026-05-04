'use client';
import { useState } from 'react';

export default function SmartLivestockPage() {
  const [selectedBreed, setSelectedBreed] = useState('ndama');
  const [bsflScale, setBsflScale] = useState('small');
  const [roi, setRoi] = useState<{ investment: number; annualReturn: number; bcr: string } | null>(null);

  const breeds = {
    ndama: { name: "N'Dama Cattle", resilience: 'Trypanotolerant, heat-resistant', meatYield: 'Moderate', milkYield: 'Low-Moderate', bcr: 1.8, icon: '🐃' },
    wadGoat: { name: 'West African Dwarf Goat', resilience: 'Drought-tolerant, prolific', meatYield: 'Low but fast turnover', milkYield: 'Low', bcr: 2.5, icon: '🐐' },
    djallonke: { name: 'Djallonké Sheep', resilience: 'Trypanotolerant, hardy', meatYield: 'Moderate', bcr: 2.2, icon: '🐑' },
    guineaFowl: { name: 'Guinea Fowl', resilience: 'Excellent foragers, pest control', eggsPerYear: '80-100', bcr: 3.0, icon: '🦃' },
    muscovy: { name: 'Muscovy Duck', resilience: 'Disease-resistant, excellent foragers', meatYield: 'High (5-7kg drakes)', bcr: 2.8, icon: '🦆' }
  };

  const bsflScales = {
    small: { investment: 500, annualReturn: 1500, bcr: 3.0 },
    medium: { investment: 5000, annualReturn: 10000, bcr: 2.0 },
    commercial: { investment: 50000, annualReturn: 75000, bcr: 1.5 }
  };

  const calculateROI = () => {
    const breed = breeds[selectedBreed as keyof typeof breeds];
    const bsfl = bsflScales[bsflScale as keyof typeof bsflScales];
    const totalInvestment = bsfl.investment + 500;
    const totalReturn = bsfl.annualReturn + (breed.bcr === 2.5 ? 800 : 600);
    setRoi({ investment: totalInvestment, annualReturn: totalReturn, bcr: (totalReturn / totalInvestment).toFixed(1) });
  };

  const G = '#1B4D3E';
  const GOLD = '#C4943A';
  const DARK = '#0A2E1A';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #14532d 55%, #166534 100%)`,
        color: '#fff', padding: '52px 24px 40px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🐄</div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Smart Livestock Farming
          </h1>
          <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', opacity: 0.85, maxWidth: 620, margin: '0 auto 20px', lineHeight: 1.6 }}>
            Indigenous breeds, Black Soldier Fly larvae, and aquaculture — The Gambia's circular food security engine
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* Breed Selector */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 16 }}>🌾 Select Indigenous Breed</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
            {Object.entries(breeds).map(([key, breed]) => (
              <button
                key={key}
                onClick={() => setSelectedBreed(key)}
                style={{
                  padding: '14px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: selectedBreed === key ? G : '#f3f4f6',
                  color: selectedBreed === key ? '#fff' : DARK,
                  border: selectedBreed === key ? 'none' : '1.5px solid #e5e7eb',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{breed.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{breed.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
            <h3 style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 8 }}>{breeds[selectedBreed as keyof typeof breeds].icon} {breeds[selectedBreed as keyof typeof breeds].name}</h3>
            <p style={{ color: '#4b5563', fontSize: 14, marginBottom: 4 }}>🌿 Resilience: {breeds[selectedBreed as keyof typeof breeds].resilience}</p>
            <p style={{ color: '#4b5563', fontSize: 14, marginBottom: 4 }}>📈 Benefit-Cost Ratio: {breeds[selectedBreed as keyof typeof breeds].bcr}</p>
          </div>
        </div>

        {/* BSFL Scale Selector */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 16 }}>🪲 BSFL Insect Farming Scale</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
            {Object.entries(bsflScales).map(([key, scale]) => (
              <button
                key={key}
                onClick={() => setBsflScale(key)}
                style={{
                  padding: '14px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: bsflScale === key ? G : '#f3f4f6',
                  color: bsflScale === key ? '#fff' : DARK,
                  border: bsflScale === key ? 'none' : '1.5px solid #e5e7eb',
                  transition: 'all 0.15s',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>{key}</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>Investment: ${scale.investment.toLocaleString()}</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>Annual Return: ${scale.annualReturn.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>BCR: {scale.bcr}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ROI Calculator */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24, textAlign: 'center' }}>
          <button
            onClick={calculateROI}
            style={{
              padding: '14px 32px',
              background: G,
              color: '#fff',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              border: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            Calculate ROI →
          </button>
          {roi && (
            <div style={{ marginTop: 20, padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
              <p style={{ fontWeight: 800, fontSize: 18, color: DARK, marginBottom: 8 }}>📊 Integrated System ROI</p>
              <p style={{ fontSize: 14, color: '#4b5563' }}>Investment: ${roi.investment.toLocaleString()}</p>
              <p style={{ fontSize: 14, color: '#4b5563' }}>Annual Return: ${roi.annualReturn.toLocaleString()}</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: G, marginTop: 8 }}>Benefit-Cost Ratio: {roi.bcr}</p>
            </div>
          )}
        </div>

        {/* Nutrition Benefits */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 16 }}>🥚 BSFL Nutrition Benefits</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            <div style={{ padding: 16, background: '#dbeafe', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#1e40af' }}>36-48%</p>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Crude Protein</p>
            </div>
            <div style={{ padding: 16, background: '#dbeafe', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#1e40af' }}>20-35%</p>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Healthy Lipids</p>
            </div>
            <div style={{ padding: 16, background: '#dbeafe', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#1e40af' }}>2:1</p>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Ca:P Ratio</p>
            </div>
          </div>
        </div>

        {/* Partnership CTA */}
        <div style={{ marginTop: 24, padding: 32, background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', borderRadius: 16, textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🤝 Partner With Us</h2>
          <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 16 }}>Join Fortis Invicta in building The Gambia's first integrated smart livestock and circular feed system.</p>
          <a href="/contact" style={{ display: 'inline-block', padding: '12px 24px', background: '#fff', color: G, borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Become a Partner →
          </a>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 32, lineHeight: 1.7 }}>
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
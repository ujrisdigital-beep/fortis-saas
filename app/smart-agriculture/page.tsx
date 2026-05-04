'use client';
import { useState } from 'react';

export default function SmartAgriculturePage() {
  const [selectedCrop, setSelectedCrop] = useState('faidherbia');
  const [omfScale, setOmfScale] = useState('small');
  const [roi, setRoi] = useState<{ year1: { cost: number; profit: number }; year2: { cost: number; profit: number }; year3: { cost: number; profit: number } } | null>(null);

  const crops = {
    faidherbia: { name: 'Faidherbia albida', type: 'N-fixing tree', benefit: 'Triples maize yields', nitrogen: 'High', icon: '🌳' },
    mucuna: { name: 'Mucuna pruriens', type: 'Cover crop', benefit: 'Weed suppression, Striga control', nitrogen: 'High', icon: '🌿' },
    pigeonPea: { name: 'Pigeon Pea', type: 'Perennial legume', benefit: 'Food, fodder, 3-5 year lifespan', nitrogen: 'High', icon: '🫛' },
    cowpea: { name: 'Cowpea', type: 'Annual legume', benefit: 'Traditional staple, intercropping', nitrogen: 'Medium', icon: '🫘' },
    sorghum: { name: 'Sorghum', type: 'Drought grain', benefit: 'Very high drought tolerance', cycle: '90-120 days', icon: '🌾' },
    millet: { name: 'Pearl Millet', type: 'Drought grain', benefit: 'Grows where maize fails', cycle: '70-90 days', icon: '🌑' },
    moringa: { name: 'Moringa oleifera', type: 'Nutrient accumulator', benefit: 'Thrives on marginal land', product: 'Leaves, oil, water purification', icon: '🌿' },
  };

  const omfScales = {
    small: { cost: 150, label: '1 hectare', year1Yield: 70, year2Yield: 120, year3Yield: 150 },
    medium: { cost: 400, label: '5 hectares', year1Yield: 65, year2Yield: 125, year3Yield: 160 },
    commercial: { cost: 2000, label: '25 hectares', year1Yield: 60, year2Yield: 130, year3Yield: 200 },
  };

  const calculateROI = () => {
    const omf = omfScales[omfScale as keyof typeof omfScales];
    const baselineYield = 1000;
    const baselinePrice = 0.5;
    
    const year1Cost = 290;
    const year2Cost = 145;
    const year3Cost = 50;
    
    const year1Revenue = baselineYield * (omf.year1Yield / 100) * baselinePrice;
    const year2Revenue = baselineYield * (omf.year2Yield / 100) * baselinePrice;
    const year3Revenue = baselineYield * (omf.year3Yield / 100) * baselinePrice;
    
    setRoi({
      year1: { cost: year1Cost, profit: year1Revenue - year1Cost },
      year2: { cost: year2Cost, profit: year2Revenue - year2Cost },
      year3: { cost: year3Cost, profit: year3Revenue - year3Cost },
    });
  };

  const G = '#1B4D3E';
  const GOLD = '#C4943A';
  const DARK = '#0A2E1A';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(135deg, ${G} 0%, #15803d 55%, #166534 100%)`,
        color: '#fff', padding: '52px 24px 40px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🌱</div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Fortis Smart Agriculture
          </h1>
          <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', opacity: 0.85, maxWidth: 620, margin: '0 auto 20px', lineHeight: 1.6 }}>
            Regenerative agriculture — soil rejuvenation, indigenous crops, and circular finance for food security
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* Three Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🦠</div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: DARK, marginBottom: 4 }}>Agrii-Fortis OMF</h3>
            <p style={{ fontSize: 12, color: '#4b5563' }}>Soil rejuvenation with microbial food + biochar</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🌾</div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: DARK, marginBottom: 4 }}>Indigenous Crops</h3>
            <p style={{ fontSize: 12, color: '#4b5563' }}>Climate-resilient, zero-waste food sources</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: DARK, marginBottom: 4 }}>Fortis Mobile Money</h3>
            <p style={{ fontSize: 12, color: '#4b5563' }}>Circular financing for regenerative farming</p>
          </div>
        </div>

        {/* Crop Selector */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 16 }}>🌿 Select Indigenous Super-Crop</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
            {Object.entries(crops).map(([key, crop]) => (
              <button
                key={key}
                onClick={() => setSelectedCrop(key)}
                style={{
                  padding: '14px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: selectedCrop === key ? G : '#f3f4f6',
                  color: selectedCrop === key ? '#fff' : DARK,
                  border: selectedCrop === key ? 'none' : '1.5px solid #e5e7eb',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{crop.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>{crop.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, background: '#fefce8', borderRadius: 12 }}>
            <h3 style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 8 }}>{crops[selectedCrop as keyof typeof crops].icon} {crops[selectedCrop as keyof typeof crops].name}</h3>
            <p style={{ color: '#4b5563', fontSize: 14, marginBottom: 4 }}>Type: {crops[selectedCrop as keyof typeof crops].type}</p>
            <p style={{ color: '#4b5563', fontSize: 14, marginBottom: 4 }}>✨ {crops[selectedCrop as keyof typeof crops].benefit}</p>
            <p style={{ color: '#059669', fontSize: 14, fontWeight: 600 }}>{(crops[selectedCrop as keyof typeof crops] as any).nitrogen || (crops[selectedCrop as keyof typeof crops] as any).cycle || (crops[selectedCrop as keyof typeof crops] as any).product}</p>
          </div>
        </div>

        {/* OMF Scale Selector */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 16 }}>🦠 Agrii-Fortis OMF Scale</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
            {Object.entries(omfScales).map(([key, scale]) => (
              <button
                key={key}
                onClick={() => setOmfScale(key)}
                style={{
                  padding: '14px 10px',
                  borderRadius: 12,
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: omfScale === key ? G : '#f3f4f6',
                  color: omfScale === key ? '#fff' : DARK,
                  border: omfScale === key ? 'none' : '1.5px solid #e5e7eb',
                  transition: 'all 0.15s',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>{key}</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>{scale.label}</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>OMF Cost: ${scale.cost}</p>
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
            Calculate Regenerative ROI →
          </button>
          {roi && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: DARK, marginBottom: 16 }}>📊 3-Year Regenerative Profit Projection</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div style={{ padding: 16, background: '#fef2f2', borderRadius: 12 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#991b1b' }}>Year 1 — Transition</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: DARK }}>${roi.year1.profit.toFixed(0)}</p>
                  <p style={{ fontSize: 12, color: '#4b5563' }}>Cost: ${roi.year1.cost}</p>
                </div>
                <div style={{ padding: 16, background: '#fefce8', borderRadius: 12 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#854d0e' }}>Year 2 — Regenerative</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: DARK }}>${roi.year2.profit.toFixed(0)}</p>
                  <p style={{ fontSize: 12, color: '#4b5563' }}>Cost: ${roi.year2.cost}</p>
                </div>
                <div style={{ padding: 16, background: '#ecfdf5', borderRadius: 12 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#065f46' }}>Year 3+ — Profit</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: DARK }}>${roi.year3.profit.toFixed(0)}</p>
                  <p style={{ fontSize: 12, color: '#4b5563' }}>Cost: ${roi.year3.cost}</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#059669', marginTop: 12, fontWeight: 600 }}>💡 +155% profit advantage vs conventional over 3 years</p>
            </div>
          )}
        </div>

        {/* Environmental Impact */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 16 }}>🌍 Environmental Impact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <div style={{ padding: 16, background: '#ecfdf5', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>80%</p>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Synthetic Fertilizer Reduction</p>
            </div>
            <div style={{ padding: 16, background: '#ecfdf5', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>2-5t</p>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Carbon Sequestration/ha/yr</p>
            </div>
            <div style={{ padding: 16, background: '#ecfdf5', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#059669' }}>2-3%</p>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Soil Organic Matter (after 3yr)</p>
            </div>
          </div>
        </div>

        {/* African Focused Species */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 8 }}>🌵 African Focused Species</h2>
          <p style={{ color: '#4b5563', fontSize: 14, marginBottom: 16 }}>High-value, drought-tolerant trees and succulents for long-term food security and export income</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🌵</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Prickly Pear Cactus</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: Very Low</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 2-3 years</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 10-20t fruit/ha</p>
            </div>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🌴</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Date Palm</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: Moderate</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 4-5 years</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 60-100kg/tree</p>
            </div>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🌳</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Baobab</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: Very Low</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 5-8 years</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 500-1000 fruit/tree</p>
            </div>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🥜</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Shea Tree</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: Low</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 10-15 years</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 20-40kg nuts/tree</p>
            </div>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🌿</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Gum Arabic</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: Very Low</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 4-5 years</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 0.5-2kg gum/tree</p>
            </div>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🪔</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Oil Palm</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: High</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 3-4 years</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 15-25t FFB/ha</p>
            </div>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🌿</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Moringa</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: Low</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 6-8 months</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 50-100t leaves/ha</p>
            </div>
            <div style={{ padding: 12, border: '1.5px solid #e5e7eb', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🍋</div>
              <p style={{ fontWeight: 700, fontSize: 13 }}>Tamarind</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Water: Low</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Harvest: 6-8 years</p>
              <p style={{ fontSize: 11, color: '#059669' }}>Yield: 150-200kg/tree</p>
            </div>
          </div>
          
          <div style={{ marginTop: 16, padding: 12, background: '#fef3c7', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>
              💰 Investment Case: Cactus for drylands • Date palms for coastal regions • Baobab & Shea for export markets
            </p>
          </div>
        </div>

        {/* Partnership CTA */}
        <div style={{ marginTop: 24, padding: 32, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: 16, textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🤝 Partner With Us</h2>
          <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 16 }}>Join Fortis Invicta in transforming Gambian agriculture to regenerative systems.</p>
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
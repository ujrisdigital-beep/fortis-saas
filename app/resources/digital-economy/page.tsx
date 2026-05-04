// app/resources/digital-economy/page.tsx
// Gambia Digital Economy — comprehensive resource hub

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const SECTIONS = [
  {
    id: "1", icon: "🌐", title: "The Relevance of a Brand's Digital Footprint", color: "#1D4ED8",
    points: [
      { head: "Enhanced Discoverability & Reach", body: "A digital presence allows businesses to be found via search engines, social media, and online directories. For Gambian SMEs, this means access to diaspora customers in the UK, US, and EU." },
      { head: "Trust & Reputation Building", body: "Online reviews, verified profiles, and consistent brand messaging build credibility. Consumers research businesses online before purchasing — a missing digital footprint signals an untrustworthy business." },
      { head: "Data-Driven Decision Making", body: "Digital tools provide actionable data on customer behaviour, enabling smarter product, pricing, and marketing decisions through website analytics, social media insights, and CRM platforms." },
      { head: "Sales & Revenue Growth", body: "E-commerce platforms, digital payment integrations (Wave, Africell Money, QMoney), and online marketing drive measurable sales growth — particularly important in a mobile-first economy." },
      { head: "Competitive Advantage & Resilience", body: "Businesses with established digital infrastructure recover faster from disruptions. Digital channels provide redundancy unavailable to purely offline operations." },
      { head: "Risk Management", body: "Digital contracts, e-invoicing, blockchain records, and cloud storage reduce legal and operational risks. FORTIS OS provides court-order-verified document storage for Gambian businesses." },
    ],
  },
  {
    id: "2", icon: "🇬🇲", title: "Relevance for The Gambia and Gambian Businesses", color: "#16A34A",
    points: [
      { head: "National Digital Economy Master Plan (2024–2034)", body: "The Gambia's 10-year NDEMP sets targets for 90% internet penetration, universal broadband access, digital government services, and e-commerce enabling infrastructure." },
      { head: "Digital Transformation Strategy (2023–2028)", body: "Covers public sector ICT, data governance, cybersecurity, and digital literacy. The strategy prioritises SME digitalisation as a driver of inclusive growth." },
      { head: "Internet Penetration & Infrastructure Growth", body: "Mobile penetration exceeds 110% as of 2024. 4G coverage reaches 85% of urban areas. Submarine cable (ACE) connections provide redundant international bandwidth." },
      { head: "SME-Dominated Economy", body: "SMEs account for approximately 90% of businesses and 70% of employment in The Gambia. Most operate informally without digital systems — representing an enormous untapped market." },
      { head: "Tourism, Agriculture & Trade Sectors", body: "Tourism contributes ~20% of GDP. Agriculture employs 70% of the population. Both sectors increasingly require digital presence for international marketing and export documentation." },
      { head: "Youth Demographic & Digital Potential", body: "60%+ of the population is under 25. This digital-native cohort drives social media engagement, mobile commerce, and demand for digital skills training." },
      { head: "Policy Push & Opportunities", body: "GIEPA, MOFEA, and PURA actively promote digital entrepreneurship. Government e-services expansion creates demand for digital-ready businesses." },
      { head: "Challenges Specific to Gambia", body: "High data costs, intermittent power, limited rural digital literacy, and low formal banking penetration require context-specific solutions — which FORTIS OS is designed to address." },
    ],
  },
  {
    id: "3", icon: "🚀", title: "Digital Strategies for Gambian SMEs", color: "#7C3AED",
    points: [
      { head: "Build Foundational Online Presence", body: "Register with GIEPA, create a Google Business profile, establish Facebook/Instagram pages with consistent branding. Use IKENGA™ on FORTIS OS to generate your brand identity." },
      { head: "Leverage Mobile & E-Commerce Tools", body: "Integrate Wave, QMoney, or AfriMoney for payments. List products on Gamlumo or FORTIS OS Marketplace. Enable WhatsApp Business for customer communication." },
      { head: "Digital Marketing & Customer Engagement", body: "Targeted Facebook and Instagram advertising starts from $5/day. WhatsApp broadcast lists, educational content for organic reach, and community groups build loyal audiences." },
      { head: "Skills & Capacity Building", body: "Access free training on FORTIS OS Digital Skills Hub. SADA, YEP, and IIHT Gambia offer affordable courses. Enroll staff in sector-specific simulations." },
      { head: "Operational Digitalisation", body: "Adopt QuickBooks or Wave for accounting. Use Google Workspace for collaboration. Digital receipts and invoicing reduce disputes and improve audit readiness." },
      { head: "Advanced Scale-Up Steps", body: "Build an e-commerce website via FORTIS OS Website Builder. Apply for GIEPA investment promotion grants. Explore AfCFTA digital trade corridors to access West African markets." },
    ],
  },
  {
    id: "4", icon: "🤝", title: "TANGO's Digital Transformation Initiatives", color: "#059669",
    points: [
      { head: "IT Skills Training for CSOs/NGOs", body: "TANGO has facilitated multi-cohort digital skills workshops for civil society organisations covering basic computer literacy, internet use, data management, and communication tools." },
      { head: "Digital Systems Upgrades", body: "TANGO supported member organisations in migrating from paper-based systems to digital record-keeping, email communications, and cloud-based file storage." },
      { head: "QuickBooks & Financial Tools", body: "Financial management training using QuickBooks has improved accountability, donor reporting accuracy, and audit readiness for NGO finance officers." },
      { head: "Communication & Fundraising Units", body: "Training on digital fundraising platforms (GlobalGiving, Mightycause), social media for advocacy, and newsletter tools (Mailchimp) to strengthen CSO international funding capacity." },
    ],
  },
  {
    id: "5", icon: "📊", title: "Case Studies — Successful Digital Strategies", color: "#CA8A04",
    points: [
      { head: "Gamlumo National E-Market Platform", body: "Gambia's dedicated e-commerce marketplace connecting Gambian sellers with domestic and diaspora buyers. Launched with GIEPA support — demonstrates viable digital trade in a low-infrastructure environment." },
      { head: "Ping Money — Remittance & Bill Payment Fintech", body: "Gambian-founded fintech providing instant international remittances, utility bill payment, and mobile top-up. Demonstrates scalable B2C digital financial services." },
      { head: "Youth & Women-Led Agri/Tourism SMEs (YEP/Empretec)", body: "UNDP and ITC-supported programmes have produced digitally-enabled agribusinesses using WhatsApp for orders, social media for marketing, and digital banking for payments." },
      { head: "Ghana's Digital Services Exports — Regional Inspiration", body: "Ghana exported $1.5bn+ in digital services in 2023. Gambia can replicate this through strategic digital infrastructure investment, targeting the UK, EU, and US diaspora market." },
    ],
  },
  {
    id: "6", icon: "🌍", title: "AfCFTA Digital Trade Opportunities", color: "#0891B2",
    points: [
      { head: "Market Access & Scale", body: "The African Continental Free Trade Area opens a 1.4 billion consumer market. Gambian SMEs with digital infrastructure can access this through e-commerce, digital services, and remote delivery." },
      { head: "MSME & Women/Youth Inclusion", body: "AfCFTA's MSME Protocol specifically supports informal and micro enterprises. Digital documentation requirements mean digital-ready businesses are prioritised." },
      { head: "Paperless & Efficient Trade", body: "AfCFTA promotes e-customs and paperless trade. Businesses using FORTIS OS digital documents and blockchain records are better positioned for compliant intra-African trade." },
      { head: "Fintech & Payments Interoperability", body: "The Pan-African Payment and Settlement System (PAPSS) enables real-time cross-border payments in local currencies — reducing FX costs for Gambian exporters." },
      { head: "Services & Innovation", body: "The AfCFTA Protocol on Digital Trade covers e-commerce, data flows, and digital trust. Gambian tech startups can leverage this framework to export services regionally." },
    ],
  },
  {
    id: "7", icon: "🎓", title: "Digital Skills Training Programs in The Gambia", color: "#7C3AED",
    points: [
      { head: "Smart Africa Digital Academy (SADA)", body: "Continental platform providing online courses in data science, cloud computing, AI, and cybersecurity. Free to Gambian learners through AU-Smart Africa partnership." },
      { head: "National Labour Digital Skills Development", body: "Ministry of Trade digital skills framework targeting 50,000 Gambian workers by 2027. Focuses on foundational ICT, digital financial services, and digital entrepreneurship." },
      { head: "Youth Empowerment Project (YEP / SkYE Fund)", body: "UNDP/EU-funded programme providing vocational and digital skills. Digital marketing, e-commerce, and mobile money training for young entrepreneurs." },
      { head: "Gambia Digital Innovation Sprint (UNICEF)", body: "Youth-focused hackathon identifying and developing youth-led tech solutions to local development challenges in health, education, and agriculture." },
      { head: "World Bank Tourism Digital Skills Training", body: "Programme equipping tourism sector workers with digital tools for customer engagement, online booking, social media marketing, and payment acceptance." },
      { head: "Private Providers", body: "IIHT Gambia, YMCA Gambia, The Hub Gambia, UTG ICT Centre, and GIEPA's Innovation Hub — plus FORTIS OS Digital Skills Hub for AI-powered, sector-specific courses." },
    ],
  },
  {
    id: "8", icon: "💳", title: "Fintech Training Initiatives", color: "#DC2626",
    points: [
      { head: "CBG Digital Financial Literacy", body: "Central Bank of The Gambia programme covering mobile money safety, fraud prevention, consumer rights, and digital banking use cases." },
      { head: "Gambia Interoperability Switch Program (GISP)", body: "CBG-led initiative enabling mobile money interoperability. Training for agents, merchants, and consumers on the unified payment infrastructure." },
      { head: "Visa Africa FinTech Accelerator", body: "Supports African fintech startups including Gambian ventures. Provides mentorship, technical support, and access to Visa's global payment network." },
      { head: "UNDP Regional Cybersecurity Training", body: "West Africa-focused programme covering financial sector threats, incident response, and digital fraud prevention for banking and fintech practitioners." },
    ],
  },
  {
    id: "9", icon: "🏦", title: "Gambian Fintech Startups — Case Studies", color: "#1D4ED8",
    points: [
      { head: "Ping Money", body: "Cross-border mobile money remittance platform enabling instant transfers from UK, US, and Europe to Gambian mobile wallets. Serves the 200,000+ Gambian diaspora." },
      { head: "CashUp / CASHUP App", body: "Gambian peer-to-peer digital payment app enabling instant transfers, utility bill payment, and merchant payments. Growing rapidly among urban youth." },
      { head: "Wave Mobile Money", body: "Sub-Saharan Africa's largest mobile money operator by transaction volume. Zero fees on peer-to-peer transfers, disrupting traditional mobile money pricing." },
      { head: "QMoney, AfriMoney, Nafa, APS Wallet", body: "A vibrant ecosystem of telco-operated and independent mobile wallets. Combined they serve 70%+ of Gambian adults with mobile financial services." },
    ],
  },
  {
    id: "10", icon: "🔄", title: "Digital Payments Interoperability Training", color: "#059669",
    points: [
      { head: "GISP Validation Workshops", body: "CBG's interoperability programme has trained merchants and agents to ensure seamless cross-network payments. Businesses no longer need multiple wallets to serve all customers." },
      { head: "BANTABA 2.0 (Mojaloop-based)", body: "Open-source interoperability framework enabling real-time settlement between all payment providers. Technical teams at telecoms, banks, and fintechs trained on the unified infrastructure." },
      { head: "GamSwitch Integration Training", body: "National payment switch connecting all banks and mobile money providers. Technical training on API integration, reconciliation, and dispute resolution protocols." },
    ],
  },
];

export default function DigitalEconomyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`, padding: "3rem 1.5rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Intelligence Report</span>
          </div>
          <h1 style={{ margin: "0 0 0.75rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            💡 Gambia Digital Economy — Intelligence Hub
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "65ch" }}>
            Comprehensive analysis: digital footprint relevance, SME strategies, fintech ecosystem, AfCFTA opportunities, and skills training programmes.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#section-${s.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0.4rem 0.85rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: WHITE, fontSize: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
                {s.icon} §{s.id}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {SECTIONS.map((section) => (
          <section key={section.id} id={`section-${section.id}`} style={{ marginBottom: "2.5rem", scrollMarginTop: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <span style={{ fontSize: 24 }}>{section.icon}</span>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: DARK }}>{section.title}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {section.points.map((p) => (
                <div key={p.head} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderLeft: `4px solid ${section.color}`, borderRadius: 8, padding: "1rem 1.25rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: DARK, marginBottom: "0.35rem" }}>{p.head}</div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#374151", lineHeight: 1.7 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
        <div style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, borderRadius: 12, padding: "1.5rem 1.75rem" }}>
          <p style={{ margin: "0 0 0.25rem", color: WHITE, fontWeight: 700, fontSize: "0.9rem" }}>📎 Attribution</p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", lineHeight: 1.6 }}>
            This report synthesises publicly available data from GIEPA, CBG, TANGO, World Bank, UNDP, AfDB, GSMA Intelligence, and DataReportal. All third-party content is reproduced for educational purposes in accordance with the Gambia Copyright Act 2004 (fair use) and UK CDPA 1988. Sources verified April 2026. © 2026 UJU GROUP LIMITED / FORTIS INVICTA LTD.
          </p>
        </div>
      </div>
    </div>
  );
}

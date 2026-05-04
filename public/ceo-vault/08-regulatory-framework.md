# Regulatory & Compliance Framework

## Gambian Legal Landscape
| Law | Relevance | Status |
|-----|-----------|--------|
| Data Protection Act 2013 (GDPA) | Personal data processing | Enacted — needs strengthening |
| Electronic Communications Act 2009 | Electronic transactions | Enacted |
| Cybercrime Act 2021 | Unauthorized access, data theft | Enacted |
| Consumer Protection Act 2014 | Misleading claims | Enacted |
| Electronic Transactions Act 2009 | Digital signatures | Enacted |
| Anti-Money Laundering Act | Financial transactions | Enacted |
| Digital Identity Act | Legal framework for digital ID | Not yet enacted — needed |

## Required Legal Instruments for FORTIS OS
| Instrument | Purpose | Status |
|------------|---------|--------|
| BOT Framework Agreement | Governs Build-Operate-Transfer | Draft required |
| Data Processing Agreement | GDPA compliance | Draft required |
| National Digital ID Policy | Policy framework | Needed |
| Interoperability Regulation | Payment switch authorization | CBG approval needed |
| Biometric Data Processing Policy | Specific consent framework | Draft required |

## Data Protection Principles (GDPA 2013 + GDPR alignment)
| Principle | FORTIS OS Implementation |
|-----------|--------------------------|
| Purpose limitation | Data collected only for specified, documented purposes |
| Data minimization | Attribute-based — only share what is needed |
| Storage limitation | Data retained only as long as legally required |
| Integrity & confidentiality | AES-256 at rest, TLS 1.3 in transit, HSM keys |
| User rights | Access, correction, deletion, portability — all implemented |
| Consent | Granular, revocable, auditable — stored in immutable log |
| Lawful basis | Government processing: public task; private: explicit consent |

## FORTIS OS Embedded Legal Engine
The platform includes 5 embedded Gambian laws enforced in real time:
1. **GDPA 2018** — Personal data, PII detection, consent requirements
2. **Copyright Act 2004** — Third-party content, attribution
3. **Cybercrime Act 2021** — Harmful content blocking
4. **Consumer Protection Act 2014** — Misleading claims detection
5. **Electronic Transactions Act 2019** — Digital document validity

## Compliance Certifications (Target)
| Certification | Target Timeline | Estimated Cost |
|---------------|-----------------|----------------|
| ISO 27001 | Year 1, Q4 | $50,000 |
| SOC 2 Type II | Year 2, Q2 | $75,000 |
| PCI DSS Level 2 | Year 2, Q4 | $100,000 |
| GDPA Compliance Audit | Year 1, Q2 | $15,000 |

## Regulatory Engagement Plan
| Regulator | Required Approval | Timeline |
|-----------|------------------|----------|
| Central Bank of Gambia (CBG) | Payment switch license | 6–12 months |
| PURA | Data processing license | 3–6 months |
| Ministry of Justice | Data protection registration | 1–3 months |
| GCAA | Airport data API use | 1 month |

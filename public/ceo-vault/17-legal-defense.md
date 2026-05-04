# Legal Defense Pack

## Key Legal Documents Required
| Document | Purpose | Urgency | Owner |
|----------|---------|---------|-------|
| BOT Framework Agreement | Governs Build-Operate-Transfer | Critical | Legal Counsel + AG Office |
| Data Processing Agreement | GDPA compliance | Critical | DPO |
| Terms of Service (government) | Government integration | High | Legal Counsel |
| Terms of Service (private sector) | Commercial integrations | High | Legal Counsel |
| Privacy Policy (citizens) | Citizen-facing consent | Critical | DPO |
| Technical Partner Agreement | MOSIP / infrastructure partners | High | CTO + Legal |
| Donor Grant Agreement | World Bank, UNDP, EU | High | CEO + Legal |
| HSM Key Management Policy | Sovereign key control | High | CTO |
| Breach Response Plan | Data breach readiness | High | CISO + Legal |
| Biometric Data Policy | Special category data | Critical | DPO |
| Code Escrow Agreement | Source code protection | Medium | CTO + Legal |

## Intellectual Property Framework
| Asset | IP Type | Owner | Protection |
|-------|---------|-------|------------|
| FORTIS OS platform | Trade secret + copyright | FORTIS INVICTA LTD | Registered copyright, watermarking |
| IKENGA™ AI engine | Trademark + trade secret | UJU GROUP LIMITED | Trademark registered |
| UJU Cycle™ methodology | Trademark | UJU GROUP LIMITED | Trademark registered |
| Ask UJRIS™ | Trademark | UJU GROUP LIMITED | Trademark registered |
| MOSIP components | Open-source (Apache 2.0) | Community | License compliance maintained |
| BOT model design | Trade secret | FORTIS INVICTA LTD | Confidentiality agreements |

## Legal Arguments — Prepared Responses

**"This violates data protection law."**
"The system is built on consent architecture that exceeds legal requirements. No processing occurs without explicit, granular, revocable consent. Every access is logged. Citizens have full rights under GDPA 2013: access, correction, deletion, portability. We have conducted a full Data Protection Impact Assessment (DPIA). We invite the regulator to review it."

**"This is a procurement violation."**
"FORTIS OS operates under a Development Partnership / Build-Operate-Transfer framework, not a standard procurement contract. BOT arrangements are internationally standard for infrastructure (cf. road concessions, power plants). The model has been reviewed by international development lawyers. We welcome the Attorney General's review."

**"Foreign ownership of national infrastructure is illegal."**
"Ownership transfers to the Government of The Gambia at Year 7. FORTIS INVICTA operates as a facilitator, not a permanent owner. This is explicitly structured to create Gambian sovereignty, not foreign dependency. The BOT model is designed specifically to avoid perpetual foreign ownership."

**"This could enable government surveillance."**
"The system's consent architecture makes surveillance structurally impossible without citizen knowledge. Every data access is logged in an immutable audit trail. Citizens can view all accesses to their data. Parliament and an independent oversight committee can access all system logs. The code is open-source and auditable."

## Anti-Corruption Statement
"FORTIS OS operates with full transparency. All contracts are published publicly. All transactions are auditable. All data access is logged. We have engaged independent external auditors from inception. Corruption is not just illegal under Gambian law — it is structurally incompatible with our open-source, consent-first architecture. We invite any investigation."

## Data Ethics Framework — Six Principles
1. **Consent First** — No data collected or processed without explicit consent
2. **Purpose Bound** — Data used only for specified, documented purposes
3. **Minimization** — Only the minimum necessary data is collected
4. **Transparency** — Citizens know exactly what data is held, by whom, and why
5. **Accountability** — FORTIS INVICTA is legally and financially liable for breaches
6. **Auditability** — All data access is logged, timestamped, and reviewable

## Trade Secret & IP Protection (Platform)
The FORTIS OS platform includes active technical protection:
- Right-click and source inspection disabled in production
- Forensic watermarking on all rendered content (invisible UID per session)
- DevTools detection and logging to security endpoint
- HTTP security headers: X-Frame-Options, X-Content-Type-Options, X-Copyright
- Legal inquiry portal at `/legal/inquiries` (legal@fortisos.gm)

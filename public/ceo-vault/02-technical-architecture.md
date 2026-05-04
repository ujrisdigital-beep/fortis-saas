# Technical Architecture – Deep Dive

## Identity Layer Specifications
| Component | Specification |
|-----------|---------------|
| Identity Model | Hybrid (Federated + Self-Sovereign + Biometric) |
| Biometric Standards | ISO/IEC 19794-2 (fingerprint), ISO/IEC 19794-5 (face) |
| Unique Identifier | 12-digit national ID (algorithmic, non-reassignable) |
| De-duplication | 1:N matching with 99.99% accuracy |
| Authentication | OIDC + FIDO2 + WebAuthn |
| Throughput | 1,000 identities/minute |
| Core Engine | MOSIP (open-source, auditable) |

## Payment Layer Specifications
| Component | Specification |
|-----------|---------------|
| Gateway Type | Interoperable switch (mobile money ↔ banks ↔ government) |
| Protocol | ISO 20022 |
| Settlement | Real-time gross settlement (RTGS) |
| Transaction Throughput | 500 TPS (standard), 2,000 TPS (scaled) |
| Fee Structure | 0.5–1.5% per transaction |
| Supported Networks | QMoney, Afrimoney, Trust Bank, GCNET |

## Data Exchange Layer Specifications
| Component | Specification |
|-----------|---------------|
| Architecture | API-first, event-driven, microservices |
| Consent Model | Granular, revocable, auditable |
| Authentication | OAuth 2.1 + JWT + mTLS |
| Audit Trail | Immutable, timestamped, append-only |
| API Gateway | Kong / AWS API Gateway (on-prem option) |
| Rate Limiting | Per-consumer quotas enforced |

## Sovereign Cloud Layer Specifications
| Component | Specification |
|-----------|---------------|
| Deployment | Hybrid (on-premise + sovereign cloud) |
| Data Residency | 100% within The Gambia |
| Encryption | AES-256 at rest, TLS 1.3 in transit |
| Key Management | HSM (Hardware Security Module) – sovereign key control |
| Disaster Recovery | RTO: 4 hours, RPO: 15 minutes |
| Compliance Target | ISO 27001, SOC 2 Type II |

## FORTIS OS Platform Layer (SaaS)
| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Database | Neon PostgreSQL (Prisma ORM) |
| Auth | NextAuth.js |
| AI Engine | OpenAI GPT-4 + rule-based fallbacks |
| Legal Engine | Gambian Laws (5 embedded, real-time compliance) |
| Hosting | Vercel (EU West, GDPR-compliant) |
| Domain | fortisos.cloud |

## Open Source Components Used
- MOSIP (identity) — Apache 2.0 license
- Next.js (web framework) — MIT license
- Prisma (ORM) — Apache 2.0 license
- OpenSky Network (flight data) — CC BY 4.0

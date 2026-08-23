# FORTIS OS™ Sovereign Business Network (FORTIS-SBN)
## Commercialisation, Applet Batching, Live-Data, Payment and Full-Production Master Plan

**Document status:** Revised master plan — implementation not yet authorised
**Prepared:** 23 August 2026
**Repository baseline:** 134 pages, 95 API route files, 59 Prisma models, approximately 63,000 source lines
**Commercial objective:** Convert all valuable repository modules into real, supportable, revenue-producing production services with no simulated transactions, mock operational data or false integration claims.

---

## 1. Executive decision

FORTIS-SBN should be commercialised as **five bankable applets on one shared regulated-grade platform**, not as 134 unrelated pages and 95 loosely governed endpoints.

1. **FORTIS GROW™** — business intelligence, diagnostics, strategy and investment readiness
2. **FORTIS GOVERN™** — complaints, legal intelligence, evidence, compliance and institutional casework
3. **DISCOVER GAMBIA™** — destination, culture, verified national directories, events and tourism commerce
4. **FORTIS ACADEMY / LEARN™** — learning, assessment, workforce development and verifiable credentials
5. **FORTIS PARTNER™** — marketplace, merchant services, fleet/logistics and merchant creative tools

All five will use:

0. **FORTIS CORE™** — identity, organisations, consent, entitlements, payments, provider-held funds orchestration, accounting sub-ledger, usage metering, data exchange, search, audit, notifications, administration and observability.

FORTIS CORE is not a sixth customer product. It is the shared control plane needed to honour the FORTIS-SBN service-level commitments consistently.

### Recommended bankable launch sequence

```text
CORE revenue foundation
        |
        +--> GROW paid diagnostics and reports       (earliest direct revenue)
        +--> FORTIS ACADEMY paid credentials         (repeatable low-risk revenue)
        +--> DISCOVER verified listings/ticket pilot (audience and commission revenue)
        +--> PARTNER controlled marketplace pilot    (higher GMV and regulatory complexity)
        +--> GOVERN institutional pilot              (largest contracts, longest sales/compliance cycle)
```

This order prioritises recurring and one-off revenue that can be delivered safely, while the higher-risk payment custody, marketplace, evidence and government functions complete their legal and operational gates.

---

## 2. Commercial positioning

### 2.1 Bankable position

FORTIS-SBN is positioned as:

> **The Gambia-focused business, public-data and commerce network that converts verified national information into business decisions, skills, discovery and trusted transactions.**

The defensible commercial assets are not merely AI screens. They are:

- a verified Gambian data and source-provenance layer;
- repeatable diagnostic and learning workflows;
- institution and merchant identity/verification;
- transaction and reconciliation capability;
- local-currency pricing and payment-channel integration;
- cross-applet identity, reputation and entitlements;
- auditable institutional workflows;
- low-bandwidth and assisted access suitable for the operating market.

### 2.2 Claims policy

Public claims must be supported by contracts, regulator approvals and measurable operations. Until then, FORTIS must not state or imply that it:

- is the official operating system of the Republic of The Gambia;
- has Government, CBG, GIEPA, GRA, NCAC or other institutional endorsement or integration without a signed agreement;
- itself provides regulated escrow or non-bank custody;
- provides blockchain-backed certificates without a deployed chain, issuer policy and verifier;
- guarantees a contractual SLA before the service has measured performance and an operational support rota;
- publishes official live data unless the source, timestamp and status are shown.

Approved interim language includes:

- “Gambia-focused”;
- “designed for the FORTIS-SBN service model”;
- “sourced from [named official/open source]”;
- “payment processing or safeguarded funds provided by [licensed provider]”;
- “tamper-evident, cryptographically signed credential”;
- “target service objective” rather than “guaranteed SLA” before contracting.

An institutional licence or government concession can unlock stronger language only after the relevant counterparty approves it.

---

## 3. Revenue architecture

```text
                         FORTIS-SBN REVENUE ENGINE
                                     |
       +--------------+--------------+--------------+--------------+
       |              |              |              |              |
  Subscriptions   Outcome units   Transaction fees  Sponsorship  Contracts/APIs
  and seats       and exports     and commissions  and listings Institutional SLA
```

### 3.1 Revenue lines in recommended order

1. **GROW reports and subscriptions**
   - Free diagnostic preview
   - Paid full report/blueprint
   - Business subscription
   - Organisation seats
   - Contracted bank/enterprise data service after model governance

2. **FORTIS ACADEMY credentials and seats**
   - Free learning
   - Paid verified assessment/credential
   - Corporate training seats
   - Institution-authored programmes and reporting

3. **DISCOVER listings and ticketing**
   - Verified free base listing
   - Fixed-price, clearly labelled featured listing
   - Ticket commission
   - Referral/booking commission when a real provider integration exists

4. **PARTNER merchant and transaction revenue**
   - Free merchant onboarding tier
   - Growth subscription
   - Provider-settled marketplace commission
   - Fleet/logistics commission
   - Ikenga creative add-on

5. **GOVERN institutional contracts**
   - Free eligible citizen intake where contractually funded
   - Annual institutional workspace licence
   - Implementation/integration fee
   - Support and data-governance SLA

6. **Metered enterprise services**
   - Diagnostic run
   - Document analysis
   - Report generation
   - Credential issuance
   - Media generation
   - Verified data export/API request

### 3.2 Sell outcomes, meter resources internally

Customers should buy understandable units such as:

- one full diagnostic;
- one document review up to a defined page limit;
- one business blueprint export;
- one assessment attempt;
- one verified credential;
- one media minute or render;
- one organisation seat;
- one thousand verified data records or API calls.

Raw model tokens and compute time remain internal cost-accounting units. This avoids confusing bills and allows the AI implementation to change without changing the commercial promise.

### 3.3 Canonical pricing

The proposal and current code contain conflicting plan names and prices. Production will have one database-owned catalogue:

- `Product`
- `Applet`
- `Plan`
- `Price`
- `BillingPeriod`
- `Entitlement`
- `UsageAllowance`
- `OverageRate`
- `Promotion`
- `TaxRule`
- `ContractPrice`

No page or API will hard-code authoritative prices. Initial price points from the FORTIS-SBN schedule are hypotheses and will be validated with pilot customers before public annual commitments.

Recommended public simplification:

| Tier | Commercial role | Initial packaging direction |
|---|---|---|
| Explorer | acquisition | Free public data, learning and limited diagnostic units |
| SME Growth | core self-serve revenue | GROW + selected ACADEMY/PARTNER tools and usage allowance |
| Pro Enterprise | organisation revenue | seats, exports, higher usage, merchant/fleet features and priority support |
| Sovereign Partner | negotiated contract | SSO/integration, dedicated capacity, governance and contractual SLA |

Applet add-ons and one-off purchases avoid forcing every customer into an unnecessarily expensive bundle.

### 3.4 Forecast discipline

The stated three-year totals are retained as **commercial targets, not forecasts**, until a bottom-up model exists. The bankable model will calculate:

- leads and verified conversion rates;
- average revenue per account;
- churn and expansion;
- payment success/refund/chargeback rates;
- GMV by marketplace cohort;
- gross take rate versus net recognised revenue;
- provider, support and infrastructure costs;
- AI/computation cost per outcome;
- contribution margin by applet;
- institutional sales cycle and implementation cost;
- cash timing for settlement reserves and refunds.

A base, downside and upside case will replace a single unqualified growth chart after pilot evidence is available.

---

## 4. Applet batching matrix

A route is not automatically a product module. Stage 0 will register every route, API, model, dataset and job and assign an owner, status and applet.

Statuses:

- **Retain** — valuable implementation to harden
- **Merge** — consolidate duplication
- **Rebuild** — useful concept but unsafe/simulated implementation
- **Integrate** — incomplete until a real source/provider is connected
- **Retire** — no validated value or unacceptable risk

No module will remain publicly represented as working when its real dependency is absent.

### 4.1 FORTIS CORE™

| Capability | Current repository assets | Production decision |
|---|---|---|
| Identity | `/auth/*`, NextAuth, `User` | Upgrade, email verification, session security and optional MFA |
| Organisations | `Organisation`, `orgId`, global roles | Rebuild memberships and tenant-scoped roles |
| Admin | `/admin/*`, `/board/dashboard` | Merge into protected control plane |
| Product catalogue | pricing/subscription/payment pages and subscription API | Rebuild as database-owned catalogue |
| Entitlements | scattered route logic | New central policy service |
| AI usage | OpenAI in-memory counters, token routes | Replace with durable usage ledger |
| Payments | payment reference and subscription simulations | Replace with licensed provider integration and signed webhooks |
| Funds sub-ledger | marketplace/car-hire escrow concepts | Rebuild double-entry, append-only and provider-reconciled |
| Files | evidence/media upload concepts | Private storage, scanning, retention and signed access |
| Notifications | Nodemailer/Resend and alert utilities | Queue, templates, consent, delivery log and retry |
| Data exchange | sources, curation and cron routes | Build source adapters, provenance, validation and publishing |
| Audit | court order/access/compliance logs | Consolidate immutable audit events |
| Operations | health, diagnostics and metrics | Real telemetry; protect internal information |

### 4.2 FORTIS GROW™

**Buyers:** SMEs, exporters, advisers, banks, investors and enterprise teams.

| Module | Existing assets | Full-production outcome |
|---|---|---|
| Business diagnostic | UJU Cycle, UJU unified and engine | Versioned assessment, explainable scoring and stored outcomes |
| Business/risk score | `/api/v2/credit-score` | Validated model card, consent, explainability and appeal route |
| Strategy blueprint | UJU, document and presentation generation | Reproducible, stored report with paid export |
| Grants/funding | funding/grants pages and APIs | Live sourced opportunities, eligibility and application workspace |
| Investor readiness | investor pack and investor pages | Organisation data room and controlled export |
| Calculators | tax, agriculture, livestock, soil, salt | Versioned formulas, source and assumption disclosures |
| National/economic intelligence | GBoS, census, GDP, inflation, finance | Live-source Core data products surfaced in GROW |
| Website builder | website-builder routes | Optional business activation add-on, no fake publishing |
| Enterprise data service | proposed bank feed | OAuth/API keys, scopes, consent, audit and contract only |

**First bankable product:** free short assessment → paid full blueprint → SME Growth subscription.

### 4.3 FORTIS GOVERN™

**Buyers/users:** citizens, public bodies, utilities, regulated organisations, ombudsman teams and legal practices.

| Module | Existing assets | Full-production outcome |
|---|---|---|
| Legal intelligence | UJRIS/ASK UJRIS, laws/rules | Citation-first retrieval with legal corpus versions |
| Complaint intake | inquiries/contact/case concepts | Structured, accessible intake with reference and consent |
| Case management | UJRIS case dashboard and `Case` | Assignment, state history, correspondence, deadlines and reporting |
| Evidence vault | evidence APIs and PII utilities | Encrypted evidence, malware scan and chain-of-custody |
| Compliance support | compliance pages/engine/logs | Rules and evidence with human determination, not autonomous judgment |
| Mediation/disputes | marketplace dispute concepts | Shared dispute workflow and enforceable permissions |
| Whistleblower vault | proposed | Isolated high-security build after threat model and legal review |
| Court-order access | court-order models/admin | Separate security assessment and dual-control approval |
| CIIP | cybersecurity dashboard/resources | Restricted datasets and formally authorised audience |
| Institutional dashboard | government/national assets/admin | Tenant-isolated contracted workspace |

**Commercial model:** public-interest intake funded by contract; annual defendant/institution workspace; implementation and support fee.

### 4.4 DISCOVER GAMBIA™

**Buyers/users:** tourists, diaspora, residents, organisers, hotels, guides and cultural institutions.

| Module | Existing assets | Full-production outcome |
|---|---|---|
| Destination discovery | discover and tourism routes | Unified search-led mobile experience |
| Maps/3D | Leaflet, Google/Earth, distance tools | Verified coordinates, cost/privacy controls and graceful fallback |
| Heritage/culture | heritage, culture, festivals, recipes | Rights-cleared editorial content with provenance |
| National directory | education, embassies, government, emergency, bodies, partners | Verified listing, freshness and correction workflow |
| Transport/airport | airport, ports/ferries | Real adapter where available; otherwise dated official schedule |
| Currency | currency routes | CBG-sourced timestamped reference rates, cached and attributed |
| Events/ticketing | festival concepts | Real organiser, inventory, checkout, QR validation and refunds |
| Booking/referral | not materially complete | Real inventory/provider agreement before advertising booking |
| Sponsorship | proposed | Fixed labelled inventory and reporting before auctions |

**Traffic-to-revenue strategy:** high-quality free discovery builds demand; verified listings and a controlled ticket pilot monetise it.

### 4.5 FORTIS ACADEMY / LEARN™

**Buyers/users:** students, professionals, civil servants, employers and training providers.

| Module | Existing assets | Full-production outcome |
|---|---|---|
| Catalogue | training hub and `TrainingProgram` | Approved, versioned programmes with prerequisites |
| Learning player | learn/my-learning pages | Durable progress, resume, accessibility and low-data mode |
| Simulation learning | industry simulations | Real pedagogical scenarios and validated scoring, never fake transactions |
| Assessment | assessment APIs/models | Secure attempts, question banks, accommodations and review |
| AI tutor | UJU/generation concepts | source-grounded local/free AI with safe fallback |
| Credentials | issue/verify APIs and certificate model | digitally signed tamper-evident credential and revocation |
| Employer matching | employer models/dashboard | explicit learner consent and explainable matching |
| Corporate seats | incomplete | organisation invitation, assignment, reporting and billing |
| Learning analytics | metrics/stats | tenant-aware event analytics and completion reporting |

**First bankable product:** free approved course → paid assessment → signed verified credential. “Blockchain” remains optional; digital signatures and a public verification registry provide practical initial trust without chain cost.

### 4.6 FORTIS PARTNER™

**Buyers/users:** merchants, buyers, vehicle/fleet owners, drivers, freight handlers and creative teams.

| Module | Existing assets | Full-production outcome |
|---|---|---|
| Merchant onboarding | seller registration/brands | KYB/KYC, beneficial owner and review workflow |
| Catalogue/inventory | marketplace products/pages | Database-authoritative products, stock and pricing |
| Cart/checkout | current cart and simulated checkout | Server-price, reserve stock and provider payment intent |
| Orders | marketplace model/pages | Transactional state machine and fulfilment history |
| Safeguarded funds | escrow-labelled APIs/models | Licensed provider custody; FORTIS reconciled sub-ledger |
| Delivery | confirmation/location routes | authenticated, replay-safe confirmation and evidence |
| Disputes/refunds | dispute APIs/pages | GOVERN-shared workflow, provider refund and audit |
| Fleet/car hire | vehicle/booking/claim/owner assets | availability, pricing, insurance/safety and real payment |
| Other services | equipment/logistics/professionals | one validated vertical at a time |
| FX | currency routes | Core quote, source, spread disclosure and expiry |
| Ikenga studio | brands/content/publish/inbox | real OAuth/provider publishing or unavailable—not simulated |
| Sponsored placement | proposed | labelled fixed placements first; auction after proven demand |

**Pilot principle:** limited merchant cohort, categories and geography. Marketplace first, fleet second; each has separate operational and regulatory gates.

---

## 5. Free-first AI and no-paid-AI-API architecture

### 5.1 Interpretation

“Prioritise free AI, no API resources” is implemented as **no mandatory paid third-party AI API dependency**. Live government and open-data integrations still require HTTP/API/feed access where offered. Eliminating all APIs would conflict with the requirement for live data and payment integrations.

Free/open AI does not mean zero operating cost: self-hosted inference consumes CPU/GPU, memory, storage, electricity and operations. FORTIS will minimise variable provider charges and measure its real infrastructure cost.

### 5.2 AI execution waterfall

```text
1. Deterministic rules/calculators/retrieval
                   |
2. Browser-native capability (speech, local search, WebAssembly)
                   |
3. In-browser open models where device permits
                   |
4. FORTIS-hosted open-source models
                   |
5. Optional contracted/BYOK provider adapter (disabled by default)
```

#### Tier 1 — deterministic and retrieval-first

Use the repository’s scoring rules, legal rules, calculators, templates and verified source retrieval before generative AI. This is fastest, auditable and inexpensive.

#### Tier 2 — browser-native

Use standards such as Web Speech API where browser support and privacy notice permit. Use client-side extraction/search and precomputed embeddings where practical. Unsupported devices get a functional non-AI workflow, not mock output.

#### Tier 3 — in-browser open models

Evaluate WebGPU/WASM runtimes such as Transformers.js, ONNX Runtime Web or WebLLM for small summarisation, classification, embedding and extraction models. Download size, memory, battery, device support, licences and data privacy must be tested. Models are cached with version and integrity hashes.

#### Tier 4 — self-hosted open models

For tasks too large for browsers, deploy open-weight models through an internal inference service using an appropriate runtime such as vLLM or llama.cpp. Selection is benchmark-led, not brand-led. Candidate classes include:

- compact instruction models for grounded answers;
- multilingual embedding and reranking models;
- OCR/document-layout models;
- speech-to-text models such as Whisper-compatible open implementations;
- text-to-speech engines with commercially compatible voice/licence terms.

Production requirements:

- model and dataset licence register;
- pinned model hashes;
- offline evaluation by use case;
- PII redaction and retention controls;
- prompt/template versioning;
- queue, timeout, cancellation and capacity limits;
- source citations for factual answers;
- human review for legal, financial, credential and compliance outcomes;
- usage and infrastructure-cost metering.

#### Tier 5 — optional adapters

A paid API or customer-provided key can remain an optional enterprise adapter only after explicit approval. It must never silently change a free workflow into billable consumption.

### 5.3 No hallucinated “live” answers

Every factual AI answer derived from public data will return:

- source name and URL/document reference;
- source publication date;
- FORTIS retrieval date;
- freshness state;
- relevant excerpt/indicator;
- model/rule version;
- confidence or limitation statement.

If a credible source is stale or unavailable, FORTIS displays the last verified snapshot and its date. It does not invent a current value.

---

## 6. Live government and credible open-data architecture

### 6.1 Source hierarchy

1. **Signed/contracted government integration**
2. **Official government machine-readable feed/API**
3. **Official government table, publication or downloadable file**
4. **Recognised multilateral open-data API**
5. **Verified institutional/industry source**
6. **FORTIS editorial data with named reviewer**

A lower-ranked source never silently overwrites a higher-ranked one. Conflicts enter a review queue.

### 6.2 Verified initial source candidates

The following candidates were checked during preparation; actual permission, robots terms, schema and uptime must be verified during Stage 0:

| Domain | Primary candidate | Fallback/augmentation | Expected freshness |
|---|---|---|---|
| Gambia statistics | GBoS portal (`gbosdata.org`) | World Bank WDI, IMF SDMX, ILO/UN sources | monthly/quarterly/annual by series |
| FX/monetary | Central Bank of The Gambia rates/table/publications (`cbg.gm`) | documented rate snapshot only | daily when officially published |
| Government directory | Government of The Gambia portal (`gambia.gov.gm`) | institution-verified records | daily check, manual verification |
| Culture/heritage | NCAC/government-approved records | UNESCO open data, authorised editorial records | event/change driven |
| Development indicators | World Bank open API | IMF, UN, FAOSTAT, ILOSTAT | source dependent |
| Geospatial | OpenStreetMap/OpenStreetMap data | official coordinates, partner submissions | incremental/periodic |
| Weather | credible free/open weather feed | cached last successful data | hourly/daily by licence |
| Agriculture | official ministry/GBoS where available | FAOSTAT and verified research | source dependent |
| Airport/transport | contracted operator/official feed | dated published schedule | minutes/hours if feed exists |

“Live” is a governed freshness class, not a marketing adjective:

- **Real-time:** seconds/minutes, event or feed driven
- **Current:** refreshed daily
- **Periodic official:** latest publication, with reporting period shown
- **Verified snapshot:** manually reviewed and date-stamped
- **Unavailable:** feature closed or last snapshot visibly stale

### 6.3 Data exchange pipeline

```text
Source adapter
   -> raw immutable object + checksum
   -> parser and schema validation
   -> provenance/licence metadata
   -> quality and anomaly checks
   -> conflict/reviewer queue when required
   -> versioned canonical record
   -> search/index/cache invalidation
   -> applet API and source-labelled UI
```

Each `DataSource` requires:

- legal owner and official status;
- access method and terms/licence;
- data steward;
- fetch cadence and timeout;
- schema/version;
- expected reporting lag;
- validation and anomaly thresholds;
- attribution text;
- fallback and stale-after policy;
- incident contact;
- last success/failure and next run.

### 6.4 Anti-scraping fragility

Where no supported API exists, prefer a signed data-sharing agreement or official downloadable publication. HTML/PDF extraction may be used only when terms permit and must include contract tests, checksums and human review on format changes. A scraper failure must never publish zero, stale or malformed figures as current.

### 6.5 FORTIS Data Trust Mark

Every dataset, statistic, listing and generated report receives visible trust metadata:

- official/partner/editorial classification;
- publisher;
- publication and retrieval dates;
- reporting period;
- licence/permission;
- geographic scope;
- freshness/confidence;
- reviewer and revision history;
- correction/report link.

This becomes a commercial differentiator across every applet.

---

## 7. No mocks, no simulations, no false success

### 7.1 Production rule

All mock, demo, fabricated and always-success behaviour must be eliminated from production execution paths.

Examples already identified for removal or isolation include:

- subscriptions created as `active` without a provider payment;
- payment references accepted as verified without bank/provider confirmation;
- checkout returning an escrow order without persistence or movement of funds;
- hard-coded admin metrics presented as real;
- placeholder media/audio/video outputs;
- simulated publishing where no social platform confirms publication;
- seeded predictable administrator credentials;
- static prices submitted by the browser;
- “blockchain” claims for ordinary hashes;
- “live” labels on static schedules or repository data.

### 7.2 Correct replacement behaviour

If a dependency is not integrated:

- the action is disabled or marked “coming after provider approval”;
- no success state is returned;
- no fake identifier, balance, payment, publication or booking is generated;
- a structured service-unavailable error and support reference are returned;
- the admin control plane shows the dependency and operational status.

Tests may use mocks in isolated automated test environments. Seed/demo data may exist only in development or dedicated demo tenants, visibly labelled and technically prevented from reaching production financial or official records.

### 7.3 Definition of full production

A module is “Production” only after it passes product, data, security, financial, quality and operations gates and has real upstream/downstream dependencies. Otherwise it is removed from public navigation or labelled Preview/Beta with limitations.

---

## 8. FORTIS-SBN payment and settlement architecture

### 8.1 Custody model

FORTIS should initially be a **payment orchestrator and ledger operator, not the legal custodian of customer money**. A licensed PSP, mobile-money aggregator, acquiring bank, marketplace-payments provider or trustee will hold/safeguard funds. FORTIS records provider-confirmed events in its operational double-entry sub-ledger.

“FORTIS escrow” may be used publicly only if legal counsel, CBG/regulatory requirements and the provider contract explicitly permit it. Otherwise use “provider-held protected payment” or equivalent approved language.

### 8.2 Payment flow

```text
Buyer
  -> FORTIS server creates authoritative order and amount
  -> licensed provider creates payment intent/checkout
  -> customer authorises on provider rail
  -> provider sends signed webhook
  -> FORTIS stores webhook once, verifies and posts balanced ledger entries
  -> order/subscription/ticket state advances
  -> provider settlement events reconcile daily
  -> provider releases payout under configured rules
  -> merchant statement and audit trail generated
```

The browser never determines price, commission, tax, beneficiary or payment success.

### 8.3 Minimum financial entities

- Payment customer and verified provider account
- Payment intent and attempts
- Authoritative order and order lines
- Provider webhook/event inbox
- Refund and chargeback
- Dispute and resolution
- Payout and settlement batch
- Ledger account, transaction and entries
- Balance snapshot
- Reconciliation run and exception
- Fee/tax rule and recognised revenue event
- Idempotency key and correlation ID

### 8.4 Accounting invariants

- Monetary values are integer minor units with ISO currency.
- Every posted ledger transaction balances debits and credits.
- Posted entries are never edited; corrections are reversing entries.
- Provider events are unique and replay-safe.
- Payment, refund, payout and fee states are explicit state machines.
- Provider statements reconcile to FORTIS daily.
- Exceptions cannot be silently ignored.
- Fees are recognised only according to provider event and accounting policy.
- FX source, quote, spread, timestamp and expiry are stored.

### 8.5 FORTIS-SBN SLA mapping

The supplied targets are treated as contractual design targets subject to provider capability and measured evidence:

| SLA area | Target from SBN proposal | Required implementation/evidence |
|---|---|---|
| Core availability | 99.9% | independent monitoring, monthly window, exclusions, incident process and service-credit terms |
| Mobile-money authorisation | under 1,800 ms | measure FORTIS and provider latency separately; provider contract must support target |
| Card/3DS2 | under 2,500 ms | define whether challenge time is excluded; measure p95/p99, not just average |
| Fraud/sanctions screening | 100% automated | provider/KYC vendor rules plus manual exception path and false-positive appeal |
| Digital goods/tickets | merchant credit within 2 hours | provider-confirmed capture, fraud checks and settlement definition |
| Physical goods hold | delivery sign-off or 14 days | provider-supported delayed payout, terms and consumer-law approval |
| Fleet payout | 60 minutes after verified completion | GPS/signature evidence, fraud window and provider payout capability |
| Dispute mediation | five business days | staffed queue, pause rules, evidence deadlines and escalation |
| Refund after determination | 24 hours | distinguish refund initiation from bank/customer receipt |
| FX spread | 0.85% proposed | legal/accounting approval and explicit pre-purchase disclosure |

No latency or payout promise can be guaranteed solely by application code. Provider SLAs and exclusions must flow through into the customer SLA.

### 8.6 Provider selection scorecard

Select providers using:

- CBG/licensing status and permitted marketplace model;
- Wave/QMoney/Afrimoney and bank/card coverage;
- marketplace split or delayed-payout capability;
- GMD settlement and foreign-currency support;
- 3DS2, fraud, KYC/KYB and sanctions controls;
- webhook signing, idempotency and reconciliation exports;
- refund, dispute and chargeback APIs;
- sandbox quality and certification process;
- settlement timing, reserves and fees;
- uptime/support commitments;
- data residency, privacy and subcontractors;
- contract exit and data portability.

Do not build adapters from guessed documentation. Obtain commercial and technical onboarding first.

---

## 9. Usage metering and entitlement engine

Each real resource consumption produces an append-only event:

- tenant/user and applet/feature;
- entitlement checked;
- outcome unit and quantity;
- model/rule/data-source version;
- actual CPU/GPU/time/token/storage use;
- internal cost and customer charge;
- reservation, completion or failure state;
- idempotency/correlation key;
- event and ingestion times.

Flow:

1. Authenticate and authorise tenant.
2. Resolve plan entitlement.
3. Reserve quota or create a payable unit.
4. Execute the real operation.
5. Record actual use and outcome.
6. Release unused reservation.
7. Aggregate to invoice/customer dashboard.
8. Alert/block at configured limits.

Current in-memory AI counters cannot enforce billing or budgets in a serverless system and will be replaced.

---

## 10. Cross-platform production foundations

### 10.1 Repository and delivery

- Pin Node/package-manager versions.
- Upgrade critical/high vulnerable dependencies.
- Remove tracked secrets and rotate affected credentials.
- Establish supported install, Prisma generation, lint, typecheck, test and build commands.
- Use migration files and deployment checks; no normal production `prisma db push`.
- Separate local, test, staging and production databases/providers.
- CI/CD with approval for production and safe migration sequence.
- Feature flags and kill switches for payments, AI, data feeds and publishing.

### 10.2 Identity and tenancy

- Verified email and optional verified phone.
- MFA/step-up for administrators, finance and sensitive GOVERN access.
- User, organisation, membership and tenant-scoped roles.
- Server-side RBAC/ABAC on every protected operation.
- Resource ownership and consent checks.
- Session revocation, lockout, recovery and admin audit.
- No predictable production credentials.

### 10.3 Security and privacy

- Data classification and processing register.
- Privacy impact assessments for GOVERN, KYC, location and evidence.
- Encryption at rest/in transit and field encryption for sensitive values.
- Managed secrets and key rotation.
- Private object storage, signed URLs, malware scanning and retention.
- Rate limiting, bot defence, size/type validation and CSRF/origin controls.
- Tenant isolation tests and least-privilege database/provider access.
- Dependency, secret and static analysis in CI.
- Independent penetration test before payment/GOVERN production launch.

### 10.4 Reliability and operations

- Structured logs, traces, errors, metrics and audit events.
- Service and provider health dashboards.
- Queue/dead-letter/replay operations.
- Backup, restore test, recovery objectives and disaster runbooks.
- Incident severity, on-call ownership and customer communication.
- Status page and maintenance policy.
- Capacity and cost alarms.
- Accessibility target WCAG 2.2 AA.
- Mobile/low-bandwidth performance budgets.

### 10.5 Assisted and inclusive access

- resumable forms;
- low-data pages and image/map fallbacks;
- consented SMS/WhatsApp/email notices through real providers;
- payment links and assisted onboarding;
- offline-capable ticket/credential verification where technically safe;
- keyboard, screen-reader and language-ready design;
- no exclusion of users whose devices cannot run local AI.

---

## 11. Module production gates

Every module must link evidence for all applicable gates.

### Gate A — commercial product

- named owner and buyer/user;
- validated problem and complete journey;
- revenue/entitlement and cost model;
- support and success measures;
- clear non-goals.

### Gate B — data/domain

- authoritative schema and migrations;
- validated request/event contracts;
- state machine and concurrency handling;
- provenance, retention, deletion and correction;
- real dependency and no production mock.

### Gate C — security/legal

- server authentication and authorisation;
- threat/abuse model;
- privacy, legal and claims review;
- audit events and operator controls;
- incident and appeal route.

### Gate D — financial, where applicable

- server-authoritative prices;
- real provider sandbox/certification;
- signature verification and idempotency;
- balanced ledger and reconciliation;
- refund/dispute/chargeback tests;
- finance and legal sign-off.

### Gate E — quality

- unit tests for domain rules;
- database/provider integration tests;
- end-to-end success and failure journeys;
- accessibility and responsive review;
- performance/load/failure testing;
- user acceptance evidence.

### Gate F — operations/SLA

- SLI dashboard and alert thresholds;
- support owner and runbook;
- rollback and kill switch;
- capacity and cost envelope;
- staged rollout and post-launch review.

Maturity labels:

1. **Internal** — not publicly accessible
2. **Preview** — real read-only data with limitations, no mock actions
3. **Pilot** — controlled real users/providers under explicit terms
4. **Production** — all gates passed

---

## 12. Full-production delivery programme

The commitment is to take **all retained modules** to production. This must be sequential and gated; attempting simultaneous launch would increase financial, security and regulatory risk.

### Phase 0 — definitive audit, batching and mock elimination controls (3–4 weeks)

- Map every page, API, model, job and dataset to an applet/Core.
- Record retain/merge/rebuild/integrate/retire.
- Find every mock, demo, hard-coded success, stale dataset and false-live claim.
- Remove non-real actions from public production navigation.
- Create machine-readable module/source/provider registries.
- Repair build, TypeScript, lint and dependency baseline.
- Upgrade vulnerable authentication/dependencies.
- remove tracked secrets and issue rotation register.
- Add initial CI and security/authorisation tests.
- Produce architecture records and the provider/legal decision backlog.

**Exit:** every asset has an owner/status; production can no longer accidentally present known simulations as real.

### Phase 1 — FORTIS CORE production foundation (6–9 weeks)

- tenant-aware identity/RBAC/MFA;
- product catalogue and entitlement service;
- durable usage ledger;
- source/provenance/data-trust pipeline;
- notification and file services;
- payment provider sandbox adapter;
- signed webhook inbox;
- double-entry sub-ledger and reconciliation;
- real customer/admin billing views;
- observability, backups and incident controls.

**Exit:** a real test organisation can register, verify, purchase in sandbox, receive entitlement, use a measured resource, cancel/refund and produce a complete audit/reconciliation trail.

### Phase 2 — FORTIS GROW production (5–8 weeks)

- verified onboarding and organisation profile;
- versioned UJU diagnostic and explainable score;
- live national/economic sources;
- stored strategy workspace;
- paid full report and export;
- grants/investor readiness with source dates;
- support/admin review and outcome analytics.

**Exit:** pilot SMEs can pay for a reproducible report grounded in cited live/current sources. Bank credit use remains contract/model-governance gated.

### Phase 3 — FORTIS ACADEMY / LEARN production (5–8 weeks)

- approved course registry and player;
- durable progress and low-data mode;
- secure assessment and human review controls;
- paid credential flow;
- digitally signed credential, revocation and public verification;
- corporate seats and reporting pilot;
- free/local AI tutor grounded in approved course sources.

**Exit:** a learner can complete a real approved programme, pay where required, receive a signed credential and have it independently verified.

### Phase 4 — DISCOVER GAMBIA production (6–10 weeks)

Release A:

- unified discovery/search/map;
- rights-cleared content;
- source-labelled official/open live data;
- verified institution/listing workflow;
- current/periodic freshness states and correction process.

Release B:

- organiser KYB;
- event and ticket inventory;
- provider checkout;
- QR ticket and validation;
- cancellations/refunds;
- organiser settlement reconciliation;
- fixed labelled sponsorship.

**Exit:** free national discovery is trustworthy and one controlled organiser can sell and reconcile real tickets end to end.

### Phase 5 — FORTIS PARTNER marketplace production (10–16 weeks)

- merchant KYB/KYC and approval;
- authoritative products/inventory/pricing;
- provider-held marketplace payment;
- orders, fulfilment and delivery evidence;
- merchant statements, refunds, disputes and reconciliation;
- trust/safety operations;
- limited merchant/category/geography pilot;
- Ikenga publishing only for genuinely connected platforms.

**Exit:** controlled buyers and merchants complete, refund, dispute and reconcile real transactions with no FORTIS-custody misrepresentation.

### Phase 6 — Fleet/logistics production (8–14 weeks after marketplace controls)

- owner/driver/vehicle verification;
- insurance and safety policy;
- real availability and booking;
- server-side pricing;
- provider payment and payout;
- GPS/signature completion evidence;
- cancellation, incident and claim workflows;
- controlled route/geography pilot.

**Exit:** real bookings and claims operate under approved insurance, safety, provider and settlement terms.

### Phase 7 — FORTIS GOVERN production (10–18+ weeks)

- institutional agreement and operating model;
- privacy/security/legal impact assessments;
- complaint/case/deadline/correspondence workflow;
- versioned citation-first legal corpus;
- encrypted evidence and chain-of-custody;
- tenant isolation and dual-control sensitive access;
- records retention/deletion;
- penetration test and staff training;
- controlled institutional pilot.

Whistleblower and court-order capabilities are separate high-security releases after the base case platform succeeds.

**Exit:** an authorised institution processes real cases under approved policy, security and contractual terms.

### Phase 8 — contracted SLA and ECOWAS expansion

- 60–90 days of measured internal SLO history;
- provider-backed SLA terms;
- enterprise API gateway and developer portal;
- SSO/SCIM when demanded;
- data warehouse and finance controls;
- multi-region/DR if justified;
- country-by-country legal, currency, provider and source packs.

---

## 13. FORTIS-SBN service-level operating model

### 13.1 Measure before guaranteeing

Required service-level indicators:

- availability by applet and critical journey;
- p50/p95/p99 API and page latency;
- source freshness and ingestion success;
- payment authorisation and webhook delay;
- ledger and settlement reconciliation exceptions;
- report/job completion and queue age;
- AI grounded-answer/citation quality;
- support first response and resolution;
- backup restore and incident recovery;
- credential/ticket verification success.

### 13.2 SLA contract components

- precise service boundary;
- measurement system/window/timezone;
- priority and severity definitions;
- exclusions and scheduled maintenance;
- third-party provider treatment;
- customer responsibilities;
- security/incident notice;
- service credits and claim process;
- support channels and operating hours;
- data retention/export/termination;
- change and version policy.

Do not sell “24/7/365 dedicated SRE with one-hour response” until a real staffed rota, escalation chain and incident tooling exist.

---

## 14. Testing and release assurance

The current repository has no automated test suite. Production requires:

- **Unit:** pricing, scoring, entitlement, state machines, ledger and data validation
- **Integration:** PostgreSQL, object storage, queue, payments, data sources, email and local AI
- **Contract:** provider webhooks, official/open-source schemas and format-change fixtures
- **End-to-end:** registration, purchase, report, learning, ticket, order, refund, dispute and admin
- **Financial:** duplicate/out-of-order webhook, partial refund, chargeback, payout and reconciliation invariants
- **Security:** role matrix, tenant isolation, OWASP, file abuse, rate limit and secret/dependency scan
- **AI:** task-specific accuracy, citations, unsafe output, bias, model regression and resource limits
- **Data:** stale/conflicting/missing source, parser change, anomalous value and provenance
- **Performance:** low-bandwidth, queue saturation, source/provider outage and applet load
- **Accessibility:** automation plus keyboard/screen-reader/manual review

Payment, ledger, authorisation and tenant-isolation suites are release blockers.

---

## 15. Governance artefacts

Maintain:

- product/module registry;
- source and provenance registry;
- payment/provider register;
- model and licence registry;
- data processing and retention register;
- API/event catalogue;
- architecture decisions;
- claims/legal approval register;
- pricing/version history;
- risk register;
- launch evidence per module;
- incident/change/correction log;
- SLA/SLO dashboard and reports.

Recommended accountable functions:

- Product owner per applet
- Core/platform owner
- Data steward
- Security/privacy lead
- Finance/reconciliation owner
- Trust and safety lead
- Institutional/legal owner
- Support/incident owner

---

## 16. Immediate authorised-scope proposal

The next safe package is **Phase 0**, followed by a permission checkpoint before schema migrations, provider onboarding or payment sandbox activation.

### Phase 0 deliverables

1. Machine-readable registry of every page, API, model, dataset and scheduled job.
2. Final Core/GROW/GOVERN/DISCOVER/FORTIS ACADEMY/PARTNER ownership map.
3. Retain/merge/rebuild/integrate/retire decision for every asset.
4. Complete mock/simulation/false-live inventory and public exposure controls.
5. Applet-oriented information architecture and compatibility route plan.
6. Repaired install/build/lint/typecheck baseline with pinned runtime.
7. Critical dependency and secret remediation.
8. Initial CI, authorisation matrix and tests.
9. Core schema designs for identity, products, entitlement, metering, payments and ledger—design only.
10. Live-source adapter specification and verified source register.
11. Free/local AI benchmark plan and model/licence shortlist.
12. Payment-provider selection dossier aligned with the FORTIS-SBN SLA.
13. Detailed Phase 1 backlog with acceptance criteria, dependencies and updated estimates.

### Not included without further approval

- live payment capture;
- production database migrations;
- customer fund custody;
- real KYC/KYB submissions;
- signing external contracts;
- claiming government/regulator endorsement;
- enabling a module whose real provider/source has not passed its gate.

---

## 17. Approval requested

Recommended authorisation:

> **Approve Phase 0: definitive applet batching, elimination of production mocks/false-live states, engineering security baseline, live-data design, free/local AI design, and FORTIS CORE architecture. Return with evidence and the Phase 1 implementation backlog before any live payment or destructive production change.**

Available execution choices:

1. **Phase 0 only — recommended**
2. **Phase 0 plus immediate GROW/Core sandbox implementation** after the Phase 0 audit, with no live money
3. **Plan approval only** with no implementation

Every move from sandbox to live payments will require a separate explicit approval after provider, legal, finance, security and reconciliation gates are evidenced.

---

## Appendix A — source references reviewed for this plan

- Gambia Bureau of Statistics: `https://www.gbosdata.org/`
- Government of The Gambia: `https://gambia.gov.gm/`
- Central Bank of The Gambia: `https://www.cbg.gm/`
- CBG indicative exchange rates: `https://www.cbg.gm/indicative-exchange-rates-latest`
- World Bank Open Data — The Gambia: `https://data.worldbank.org/country/gambia`
- World Bank SDMX API documentation: `https://datahelpdesk.worldbank.org/knowledgebase/articles/1886701-sdmx-api-queries`
- IMF Data API: `https://data.imf.org/en/Resource-Pages/IMF-API`

These are source candidates, not evidence of a signed FORTIS integration. Stage 0 will verify terms, permissions, machine interfaces and operational suitability.

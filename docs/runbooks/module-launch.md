# Module launch checklist

- [ ] Feature flag default documented in `lib/core/feature-flags.ts`
- [ ] Authorization matrix applied to every write API
- [ ] Entitlement/metering for paid units
- [ ] Live data provenance or explicit UNAVAILABLE state
- [ ] Deterministic fallback if inference is off
- [ ] Status check listed on `/api/v2/status`
- [ ] Runbook owner named
- [ ] Accessibility: keyboard focus, contrast, no colour-only meaning
- [ ] Low-bandwidth: JSON APIs usable without client JS bundles
- [ ] Rollback = flag off, not schema drop

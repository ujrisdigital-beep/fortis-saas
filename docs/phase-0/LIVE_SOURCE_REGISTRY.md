# Live source registry — initial candidates

This is a provider-discovery register, not evidence of signed integration. Every source must pass access, licence, schema, provenance and operational review.

| ID | Domain | Candidate | Authority | Method | Target cadence | Fallback | Gate |
|---|---|---|---|---|---|---|---|
| GB-GBoS | statistics | https://www.gbosdata.org/ | official statistics body | confirm API/feed/download; avoid fragile scrape | publication-driven + daily check | World Bank/IMF/ILO with separate provenance | permission and adapter contract test |
| GB-CBG-FX | FX/monetary | https://www.cbg.gm/indicative-exchange-rates-latest | official central bank | official table/PDF until supported feed agreed | daily publication | last verified snapshot, visibly dated | terms, parser and anomaly review |
| GB-GOV | institutions | https://gambia.gov.gm/ | official government portal | feed/API or reviewed publication | daily check | institution-verified listing | owner and correction workflow |
| GB-NCAC | culture/heritage | NCAC/government records | official/authorised | data-sharing agreement preferred | change/event-driven | UNESCO and authorised editorial | rights and cultural review |
| WB-WDI | development indicators | https://api.worldbank.org/ | multilateral open data | SDMX/REST | source dependent | official national source preferred | licence/metadata mapping |
| IMF-SDMX | macroeconomics | https://data.imf.org/en/Resource-Pages/IMF-API | multilateral open data | SDMX 2.1/3.0 | source dependent | CBG/GBoS | series/version mapping |
| OSM | geospatial | OpenStreetMap | open community geodata | approved tile/data service or self-host | incremental | partner/official coordinates | ODbL attribution and tile policy |
| FAOSTAT | agriculture | FAO open data | multilateral | API/download | source dependent | ministry/GBoS | indicator provenance |
| ILOSTAT | labour | ILO open data | multilateral | SDMX | source dependent | GBoS labour surveys | definition comparability |
| WEATHER | weather | provider to select | credible open feed | JSON feed | hourly/daily | cached last success | licence, rate and attribution |
| AIRPORT | flights | operator/provider to contract | official/contracted | API/feed | minutes | dated schedule only | agreement and reliability |
| PAYMENT | money movement | licensed provider to select | regulated provider | signed API/webhooks | real-time | no simulated fallback | regulatory/provider certification |

## Canonical provenance fields

Every canonical record must retain:

- source ID and source record ID;
- source/publisher name;
- official/partner/open/editorial classification;
- source URL/document reference;
- publication and reporting dates;
- retrieved date and adapter version;
- licence/permission and required attribution;
- checksum of raw payload;
- geographic/indicator scope and units;
- quality/freshness state;
- reviewer and review timestamp where applicable;
- superseded/corrected relationship.

## Freshness states

- `REAL_TIME`: seconds or minutes, feed/event-driven
- `CURRENT`: refreshed at least daily
- `PERIODIC_OFFICIAL`: latest official reporting period
- `VERIFIED_SNAPSHOT`: manually reviewed and date-stamped
- `STALE`: beyond source-specific threshold
- `UNAVAILABLE`: no credible current value; feature fails closed

The user interface must show the state and dates. It must never label a periodic publication as real-time.

# Live and published open data

Dashboards now prefer **published open APIs**, then a **dated snapshot**. They never jitter fake rates or seasonal weather as live.

| Feed | Source | Google / open | Route |
|---|---|---|---|
| GDP, growth, per capita | World Bank WDI | [Google Public Data](https://www.google.com/publicdata/explore?ds=d5bncppjof8f9_) | `/api/gbos/gdp` |
| Population, urban, life expectancy | World Bank WDI | same | `/api/gbos/census`, `/api/national-stats` |
| CPI inflation | World Bank WDI | same | `/api/gbos/inflation` |
| Banjul weather | [Open-Meteo](https://open-meteo.com/) (open licence) | — | `/api/weather` |
| USD/EUR/GBP | Frankfurter / ECB reference | — | `/api/marketplace/currency-rates` |

Bundle: `GET /api/v2/data/live`

Refresh snapshot (needs outbound HTTPS to `api.worldbank.org`):

```
npm run data:refresh
```

Frankfurter is **not** CBG official. Weather failure returns 503, not a guessed Harmattan reading.

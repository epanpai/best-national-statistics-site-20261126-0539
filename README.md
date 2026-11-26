[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/epanpai/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/epanpai/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# Meridia Statistics — the national statistics site of Meridia

An entry for the [make.fun bounty “Make the best national statistics
site”](https://make.fun/bounty/best-national-statistics-site-20261126-0539):
a working national statistics portal for the fictional country of Meridia,
built as plain static files with no build step and no network request.

## What it is

The Meridia National Statistics Office publishes Meridia's official
figures — population, economy, labour, prices, regions — on ten linked
pages, each with real figures, charts and a named source and year:

- **Overview** — key figures for a chosen year, population and GDP-by-sector charts, latest releases
- **Population** — population trend (line or bar), age structure, births, deaths and migration
- **Economy** — GDP, growth, trade balance, sectors, top export goods
- **Labour** — unemployment, employment rate, median wage, jobs by sector
- **Prices** — CPI inflation, the price basket and price change by item
- **Regions** — all eight regions in a sortable table, plus a region in focus
- **Releases** — the publication calendar
- **Datasets** — the figures as downloadable CSV files, with search
- **Methods** — how each figure is made
- **About** — the Office and its principles

Every control works: the year selector re-renders the figures and charts,
the region selector changes the region in focus, table headings sort, the
dataset search filters, and the chart toggle switches line and bars.
Charts are hand-drawn on canvas — no library, so the first load is small.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

Open http://localhost:8080 in a browser, on desktop or on a phone.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.

## Licence

MIT — see [LICENSE](LICENSE).

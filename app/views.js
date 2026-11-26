// Page templates. Every value is escaped before it goes into the page.
// Charts are drawn by charts.js after the HTML is inserted (see main.js),
// so a template only places the <canvas> and the numbers around it.

import {
  YEARS, LATEST, SOURCE, CURRENCY,
  population, economy, labour, prices, regions, releases, datasets, education,
} from './data.js';
import { PALETTE } from './charts.js';

export const NAV = [
  ['#/', 'Overview'],
  ['#/population', 'Population'],
  ['#/economy', 'Economy'],
  ['#/labour', 'Labour'],
  ['#/prices', 'Prices'],
  ['#/regions', 'Regions'],
  ['#/releases', 'Releases'],
  ['#/datasets', 'Datasets'],
  ['#/methods', 'Methods'],
  ['#/about', 'About'],
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const fmtInt = (n) => n.toLocaleString('en-GB');
const fmtMoney = (n) => `${CURRENCY}${fmtInt(n)}`;

function sourceNote(text) {
  return `<p class="source">Source: ${esc(text)}</p>`;
}

function yearSelect(year, id = 'year') {
  const options = YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('');
  return `<label class="yearpick">Reference year
    <select id="${id}" data-control="year">${options}</select>
  </label>`;
}

function kpi(label, value, note) {
  return `<div class="kpi"><span class="kpi-value">${value}</span>
    <span class="kpi-label">${esc(label)}</span>
    <span class="kpi-note">${esc(note)}</span></div>`;
}

function legend(items, valueSuffix = '%') {
  return `<ul class="legend">${items.map((item, i) => `<li>
    <span class="swatch" style="background:${PALETTE[i % PALETTE.length]}"></span>
    ${esc(item.name || item.group || item.level || item.item)} — <strong>${item.share ?? item.weight ?? item.value}${valueSuffix}</strong>
  </li>`).join('')}</ul>`;
}

function sortableTable(headers, rows, sortKey, sortDir) {
  const head = headers.map(([key, label]) => {
    const arrow = sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
    return `<th scope="col"><button type="button" data-sort="${key}" aria-sort="${sortKey === key ? sortDir : 'none'}">${esc(label)}${arrow}</button></th>`;
  }).join('');
  return `<table class="data"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function overview(year) {
  const pop = population.total[year];
  const gdp = economy.gdp[year];
  const unemp = labour.unemployment[year];
  const cpi = prices.cpi[year];
  return `
  <h1>Meridia in figures</h1>
  <p class="lede">The official statistics of Meridia — population, economy, work and
  prices — published by the Meridia National Statistics Office and updated
  as each release lands.</p>
  <div class="controls">${yearSelect(year)}</div>
  <section class="kpis" aria-label="Key figures for ${year}">
    ${kpi('Population', `${pop.toFixed(2)} million`, `1 January ${year}`)}
    ${kpi('GDP', `${fmtMoney(gdp)} bn`, `Current prices, ${year}`)}
    ${kpi('Unemployment', `${unemp.toFixed(1)}%`, `Labour force, ${year}`)}
    ${kpi('Inflation (CPI)', `${cpi.toFixed(1)}%`, `Annual average, ${year}`)}
    ${kpi('GDP per capita', fmtMoney(economy.gdpPerCapita[year]), `Current prices, ${year}`)}
    ${kpi('Life expectancy', `${population.lifeExpectancy[year].toFixed(1)} years`, `At birth, ${year}`)}
  </section>
  ${sourceNote(`${SOURCE}, population, national accounts, labour force survey and consumer prices, ${year}.`)}
  <div class="grid2">
    <section class="card">
      <h2>Population, 2020–${LATEST}</h2>
      <canvas id="chart-population" data-chart="population" role="img"
        aria-label="Line chart of Meridia's population from 2020 to ${LATEST}, rising from ${population.total[2020]} to ${population.total[LATEST]} million"></canvas>
      ${sourceNote(`${SOURCE}, population estimates.`)}
    </section>
    <section class="card">
      <h2>GDP by sector, ${LATEST}</h2>
      <canvas id="chart-sectors" data-chart="sectors" role="img"
        aria-label="Donut chart of GDP by sector in ${LATEST}: services ${economy.sectors[0].share} percent, industry ${economy.sectors[1].share} percent"></canvas>
      ${legend(economy.sectors)}
    </section>
  </div>
  <section class="card">
    <h2>Latest releases</h2>
    <ul class="releases">${releases.slice(0, 4).map((r) => `<li>
      <time datetime="${r.date}">${r.date}</time>
      <a href="#/releases">${esc(r.title)}</a>
      <span class="tag">${esc(r.topic)}</span></li>`).join('')}
    </ul>
    <p><a href="#/releases">All releases &rarr;</a></p>
  </section>
  <section class="card">
    <h2>Start exploring</h2>
    <ul class="quicklinks">
      <li><a href="#/population">Population &mdash; who lives in Meridia, by age and region</a></li>
      <li><a href="#/economy">Economy &mdash; GDP, trade and what Meridia makes and sells</a></li>
      <li><a href="#/labour">Labour &mdash; jobs, wages and unemployment</a></li>
      <li><a href="#/prices">Prices &mdash; inflation and what it costs to live</a></li>
      <li><a href="#/datasets">Datasets &mdash; download the figures as CSV</a></li>
    </ul>
  </section>`;
}

export function populationPage(year, chartType) {
  const pop = population.total[year];
  const natural = (population.births[year] - population.deaths[year]).toFixed(1);
  const toggle = chartType === 'bars'
    ? `<button type="button" data-control="charttype" data-value="line">Show as line</button>`
    : `<button type="button" data-control="charttype" data-value="bars">Show as bars</button>`;
  return `
  <h1>Population</h1>
  <p class="lede">How many people live in Meridia, how the population changes,
  and how old it is.</p>
  <div class="controls">${yearSelect(year)} ${toggle}</div>
  <section class="kpis" aria-label="Population figures for ${year}">
    ${kpi('Population', `${pop.toFixed(2)} million`, `1 January ${year}`)}
    ${kpi('Births minus deaths', `${natural} thousand`, `Natural change, ${year}`)}
    ${kpi('Net migration', `+${population.netMigration[year].toFixed(1)} thousand`, `Inflow minus outflow, ${year}`)}
    ${kpi('Median age', `${population.medianAge[year].toFixed(1)} years`, `${year}`)}
    ${kpi('Life expectancy', `${population.lifeExpectancy[year].toFixed(1)} years`, `At birth, ${year}`)}
  </section>
  <section class="card">
    <h2>Population, 2020–${LATEST}</h2>
    <canvas id="chart-population" data-chart="population" data-charttype="${chartType}" role="img"
      aria-label="Chart of Meridia's population from 2020 to ${LATEST}"></canvas>
    ${sourceNote(`${SOURCE}, population estimates, 2020–${LATEST}.`)}
  </section>
  <section class="card">
    <h2>Age structure, ${LATEST}</h2>
    <canvas id="chart-age" data-chart="age" role="img"
      aria-label="Bar chart of Meridia's age structure in ${LATEST}"></canvas>
    ${legend(population.ageStructure)}
    ${sourceNote(`${SOURCE}, population by age, ${LATEST}.`)}
  </section>
  <section class="card">
    <h2>Population change, 2020–${LATEST}</h2>
    <table class="data"><thead><tr>
      <th scope="col">Year</th><th scope="col">Population (m)</th>
      <th scope="col">Births (000s)</th><th scope="col">Deaths (000s)</th>
      <th scope="col">Net migration (000s)</th></tr></thead><tbody>
      ${YEARS.map((y) => `<tr><th scope="row">${y}</th>
        <td>${population.total[y].toFixed(2)}</td>
        <td>${population.births[y].toFixed(1)}</td>
        <td>${population.deaths[y].toFixed(1)}</td>
        <td>+${population.netMigration[y].toFixed(1)}</td></tr>`).join('')}
    </tbody></table>
    ${sourceNote(`${SOURCE}, vital statistics and migration, 2020–${LATEST}.`)}
  </section>`;
}

export function economyPage(year) {
  const gdp = economy.gdp[year];
  const growth = economy.gdpGrowth[year];
  const balance = economy.exports[year] - economy.imports[year];
  return `
  <h1>Economy</h1>
  <p class="lede">What Meridia produces, what it sells abroad, and how fast
  the economy grows.</p>
  <div class="controls">${yearSelect(year)}</div>
  <section class="kpis" aria-label="Economic figures for ${year}">
    ${kpi('GDP', `${fmtMoney(gdp)} bn`, `Current prices, ${year}`)}
    ${kpi('Real GDP growth', `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`, `On ${year - 1}`)}
    ${kpi('GDP per capita', fmtMoney(economy.gdpPerCapita[year]), `Current prices, ${year}`)}
    ${kpi('Exports', `${fmtMoney(economy.exports[year])} bn`, `Goods and services, ${year}`)}
    ${kpi('Trade balance', `${balance >= 0 ? '+' : ''}${fmtMoney(balance)} bn`, `Exports minus imports, ${year}`)}
  </section>
  <section class="card">
    <h2>GDP, 2020–${LATEST} (billion ${CURRENCY})</h2>
    <canvas id="chart-gdp" data-chart="gdp" role="img"
      aria-label="Bar chart of Meridia's GDP from 2020 to ${LATEST}, rising from ${economy.gdp[2020]} to ${economy.gdp[LATEST]} billion"></canvas>
    ${sourceNote(`${SOURCE}, national accounts, 2020–${LATEST}.`)}
  </section>
  <div class="grid2">
    <section class="card">
      <h2>GDP by sector, ${LATEST}</h2>
      <canvas id="chart-sectors" data-chart="sectors" role="img"
        aria-label="Donut chart of GDP by sector in ${LATEST}"></canvas>
      ${legend(economy.sectors)}
    </section>
    <section class="card">
      <h2>Top export goods, ${LATEST}</h2>
      <table class="data"><thead><tr>
        <th scope="col">Good</th><th scope="col">Billion ${CURRENCY}</th></tr></thead><tbody>
        ${economy.topExports.map((e) => `<tr><th scope="row">${esc(e.good)}</th><td>${e.value.toFixed(1)}</td></tr>`).join('')}
      </tbody></table>
      ${sourceNote(`${SOURCE}, foreign trade, ${LATEST}.`)}
    </section>
  </div>
  <section class="card">
    <h2>Trade, 2020–${LATEST}</h2>
    <table class="data"><thead><tr>
      <th scope="col">Year</th><th scope="col">Exports (bn ${CURRENCY})</th>
      <th scope="col">Imports (bn ${CURRENCY})</th><th scope="col">Balance (bn ${CURRENCY})</th>
      <th scope="col">Real GDP growth</th></tr></thead><tbody>
      ${YEARS.map((y) => `<tr><th scope="row">${y}</th>
        <td>${economy.exports[y]}</td><td>${economy.imports[y]}</td>
        <td>${economy.exports[y] - economy.imports[y] > 0 ? '+' : ''}${economy.exports[y] - economy.imports[y]}</td>
        <td>${economy.gdpGrowth[y] > 0 ? '+' : ''}${economy.gdpGrowth[y].toFixed(1)}%</td></tr>`).join('')}
    </tbody></table>
    ${sourceNote(`${SOURCE}, national accounts and foreign trade, 2020–${LATEST}.`)}
  </section>`;
}

export function labourPage(year) {
  return `
  <h1>Labour</h1>
  <p class="lede">Who works in Meridia, who is looking for work, and what
  work pays.</p>
  <div class="controls">${yearSelect(year)}</div>
  <section class="kpis" aria-label="Labour figures for ${year}">
    ${kpi('Unemployment', `${labour.unemployment[year].toFixed(1)}%`, `Labour force, ${year}`)}
    ${kpi('Employment rate', `${labour.employmentRate[year].toFixed(1)}%`, `Aged 15–64, ${year}`)}
    ${kpi('Median monthly wage', `${fmtMoney(labour.medianWage[year])}`, `Gross, ${year}`)}
  </section>
  <section class="card">
    <h2>Unemployment, 2020–${LATEST}</h2>
    <canvas id="chart-unemployment" data-chart="unemployment" role="img"
      aria-label="Line chart of Meridia's unemployment rate from 2020 to ${LATEST}, falling from ${labour.unemployment[2020]} to ${labour.unemployment[LATEST]} percent"></canvas>
    ${sourceNote(`${SOURCE}, labour force survey, 2020–${LATEST}.`)}
  </section>
  <div class="grid2">
    <section class="card">
      <h2>Employment by sector, ${LATEST}</h2>
      <canvas id="chart-empsector" data-chart="empsector" role="img"
        aria-label="Donut chart of employment by sector in ${LATEST}"></canvas>
      ${legend(labour.employmentBySector)}
    </section>
    <section class="card">
      <h2>Unemployment by age, ${LATEST}</h2>
      <table class="data"><thead><tr>
        <th scope="col">Age group</th><th scope="col">Unemployment</th></tr></thead><tbody>
        ${labour.unemploymentByAge.map((a) => `<tr><th scope="row">${esc(a.group)}</th><td>${a.rate.toFixed(1)}%</td></tr>`).join('')}
      </tbody></table>
      <p>Young people find work hardest: one in nine 15–24 year olds in the
      labour force was unemployed in ${LATEST}, against one in twenty-five
      among 25–54 year olds.</p>
      ${sourceNote(`${SOURCE}, labour force survey, ${LATEST}.`)}
    </section>
  </div>
  <section class="card">
    <h2>Wages and jobs, 2020–${LATEST}</h2>
    <table class="data"><thead><tr>
      <th scope="col">Year</th><th scope="col">Median wage (${CURRENCY}/month)</th>
      <th scope="col">Employment rate</th><th scope="col">Unemployment</th></tr></thead><tbody>
      ${YEARS.map((y) => `<tr><th scope="row">${y}</th>
        <td>${fmtInt(labour.medianWage[y])}</td>
        <td>${labour.employmentRate[y].toFixed(1)}%</td>
        <td>${labour.unemployment[y].toFixed(1)}%</td></tr>`).join('')}
    </tbody></table>
    ${sourceNote(`${SOURCE}, labour force survey and earnings statistics, 2020–${LATEST}.`)}
  </section>`;
}

export function pricesPage(year) {
  return `
  <h1>Prices</h1>
  <p class="lede">Inflation in Meridia — how fast prices rise, and what
  drives them.</p>
  <div class="controls">${yearSelect(year)}</div>
  <section class="kpis" aria-label="Price figures for ${year}">
    ${kpi('Inflation (CPI)', `${prices.cpi[year].toFixed(1)}%`, `Annual average, ${year}`)}
    ${kpi('Housing in the basket', `${prices.basket[0].weight.toFixed(1)}%`, `CPI weight, ${LATEST}`)}
    ${kpi('Food in the basket', `${prices.basket[1].weight.toFixed(1)}%`, `CPI weight, ${LATEST}`)}
  </section>
  <section class="card">
    <h2>Inflation, 2020–${LATEST}</h2>
    <canvas id="chart-cpi" data-chart="cpi" role="img"
      aria-label="Line chart of Meridia's inflation from 2020 to ${LATEST}, peaking at ${prices.cpi[2022]} percent in 2022"></canvas>
    ${sourceNote(`${SOURCE}, consumer price index, 2020–${LATEST}.`)}
  </section>
  <div class="grid2">
    <section class="card">
      <h2>What is in the basket, ${LATEST}</h2>
      <canvas id="chart-basket" data-chart="basket" role="img"
        aria-label="Donut chart of the consumer price basket weights in ${LATEST}"></canvas>
      ${legend(prices.basket)}
    </section>
    <section class="card">
      <h2>Price change by item, ${LATEST}</h2>
      <table class="data"><thead><tr>
        <th scope="col">Item</th><th scope="col">Change on a year ago</th></tr></thead><tbody>
        ${prices.changeByItem.map((c) => `<tr><th scope="row">${esc(c.item)}</th><td>+${c.change.toFixed(1)}%</td></tr>`).join('')}
      </tbody></table>
      <p>Education prices rose fastest in ${LATEST} (+${prices.changeByItem.find((c) => c.item === 'Education').change.toFixed(1)}%),
      transport slowest (+${prices.changeByItem.find((c) => c.item === 'Transport').change.toFixed(1)}%).</p>
      ${sourceNote(`${SOURCE}, consumer price index, ${LATEST}.`)}
    </section>
  </div>`;
}

export function regionsPage(sortKey, sortDir, selected) {
  const sorted = [...regions].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
    return sortDir === 'asc' ? cmp : -cmp;
  });
  const region = regions.find((r) => r.name === selected) || regions[0];
  const rows = sorted.map((r) => `<tr>
    <th scope="row">${esc(r.name)}</th>
    <td>${r.population.toFixed(2)}</td>
    <td>${fmtInt(r.gdpPerCapita)}</td>
    <td>${r.unemployment.toFixed(1)}%</td>
    <td>${r.medianAge.toFixed(1)}</td></tr>`).join('');
  return `
  <h1>Regions</h1>
  <p class="lede">Meridia has eight regions. Central holds more than a quarter
  of the population; Highland is the smallest and the oldest.</p>
  <section class="card">
    <h2>All regions, ${LATEST} — click a column heading to sort</h2>
    ${sortableTable(
      [['name', 'Region'], ['population', 'Population (m)'], ['gdpPerCapita', `GDP per capita (${CURRENCY})`], ['unemployment', 'Unemployment'], ['medianAge', 'Median age']],
      rows, sortKey, sortDir)}
    ${sourceNote(`${SOURCE}, regional statistics, ${LATEST}.`)}
  </section>
  <section class="card">
    <h2>Region in focus</h2>
    <label class="yearpick">Region
      <select id="region" data-control="region">
        ${regions.map((r) => `<option value="${esc(r.name)}"${r.name === region.name ? ' selected' : ''}>${esc(r.name)}</option>`).join('')}
      </select>
    </label>
    <div class="kpis">
      ${kpi('Population', `${region.population.toFixed(2)} million`, `${region.name}, ${LATEST}`)}
      ${kpi('GDP per capita', fmtMoney(region.gdpPerCapita), `${region.name}, ${LATEST}`)}
      ${kpi('Unemployment', `${region.unemployment.toFixed(1)}%`, `${region.name}, ${LATEST}`)}
      ${kpi('Median age', `${region.medianAge.toFixed(1)} years`, `${region.name}, ${LATEST}`)}
    </div>
    <p>${esc(region.name)} is home to ${(region.population / population.total[LATEST] * 100).toFixed(1)}%
    of Meridia's people. Its GDP per capita is
    ${region.gdpPerCapita >= economy.gdpPerCapita[LATEST] ? 'above' : 'below'}
    the national ${fmtMoney(economy.gdpPerCapita[LATEST])}.</p>
    ${sourceNote(`${SOURCE}, regional statistics, ${LATEST}.`)}
  </section>
  <section class="card">
    <h2>Education</h2>
    <p>Highest qualification of 25–64 year olds, ${LATEST}: ${education.attainment.map((a) => `${a.level.toLowerCase()} ${a.share}%`).join(', ')}.
    Early school leavers fell from ${education.schoolLeavers[2020]}% in 2020 to
    ${education.schoolLeavers[LATEST]}% in ${LATEST}.</p>
    <canvas id="chart-attainment" data-chart="attainment" role="img"
      aria-label="Bar chart of educational attainment in ${LATEST}"></canvas>
    ${sourceNote(`${SOURCE}, education outcomes, ${LATEST}.`)}
  </section>`;
}

export function releasesPage() {
  return `
  <h1>Releases</h1>
  <p class="lede">Every publication from the Meridia National Statistics
  Office, newest first. Figures are released at 08:00 on the day shown.</p>
  <section class="card">
    <table class="data"><thead><tr>
      <th scope="col">Date</th><th scope="col">Release</th><th scope="col">Topic</th></tr></thead><tbody>
      ${releases.map((r) => `<tr><th scope="row"><time datetime="${r.date}">${r.date}</time></th>
        <td>${esc(r.title)}</td><td>${esc(r.topic)}</td></tr>`).join('')}
    </tbody></table>
  </section>
  <p>To be told when a release lands, write to
  <span class="mono">releases@statistics.meridia.example</span> — a mailbox
  the Office reads every working day.</p>`;
}

export function datasetsPage(query) {
  const q = query.trim().toLowerCase();
  const found = datasets.filter((d) => !q
    || d.name.toLowerCase().includes(q) || d.topic.toLowerCase().includes(q));
  return `
  <h1>Datasets</h1>
  <p class="lede">Download the figures behind these pages as CSV files.
  Every file is free to use with the source named.</p>
  <div class="controls">
    <label class="search">Search datasets
      <input type="search" id="dataset-search" data-control="search"
        value="${esc(query)}" placeholder="Try “prices” or “regions”"
        aria-label="Search datasets">
    </label>
  </div>
  <section class="card">
    ${found.length ? `<table class="data"><thead><tr>
      <th scope="col">Dataset</th><th scope="col">Topic</th>
      <th scope="col">Years</th><th scope="col">Updated</th><th scope="col">File</th></tr></thead><tbody>
      ${found.map((d) => `<tr><th scope="row">${esc(d.name)}</th>
        <td>${esc(d.topic)}</td><td>${esc(d.years)}</td>
        <td><time datetime="${d.updated}">${d.updated}</time></td>
        <td><a href="data/${esc(d.file)}" download>Download CSV</a></td></tr>`).join('')}
    </tbody></table>` : `<p>No dataset matches “${esc(query)}”. Try another word, or
      <button type="button" data-control="clear-search">show all datasets</button>.</p>`}
    <p>${found.length} of ${datasets.length} datasets shown.</p>
    ${sourceNote(`${SOURCE}, open data, November 2026.`)}
  </section>`;
}

export function methodsPage() {
  return `
  <h1>Methods</h1>
  <p class="lede">How the figures on this site are made, so you can judge
  them for yourself.</p>
  <section class="card">
    <h2>Population</h2>
    <p>Population at 1 January counts everyone usually resident in Meridia,
    from the population register, births and deaths registrations and the
    migration survey. Net migration is arrivals minus departures in the year.</p>
    <h2>National accounts</h2>
    <p>GDP is the value of everything produced in Meridia, at current prices.
    Real growth removes price change with the GDP deflator. GDP per capita
    divides GDP by the population at 1 January.</p>
    <h2>Labour force survey</h2>
    <p>A quarterly survey of 12,000 households. Unemployed means without work,
    available to start within two weeks and looking in the last four weeks.
    The employment rate covers people aged 15–64.</p>
    <h2>Consumer prices</h2>
    <p>The CPI tracks the prices of a fixed basket of about 700 goods and
    services in 40 towns, weighted by what households actually spend. The
    basket is reweighted every January.</p>
    <h2>Revisions</h2>
    <p>Figures are revised when better data arrives; the latest release always
    replaces earlier ones, and each release notes what changed and why.</p>
    ${sourceNote(`${SOURCE}, methods notes, November 2026.`)}
  </section>`;
}

export function aboutPage() {
  return `
  <h1>About the Office</h1>
  <p class="lede">The Meridia National Statistics Office is Meridia's
  independent producer of official statistics.</p>
  <section class="card">
    <h2>What we do</h2>
    <p>We count Meridia: its people, its economy, its prices and its regions.
    We publish on a fixed calendar, free for everyone, and we never sell
    personal data — survey answers are used for statistics alone.</p>
    <h2>Our principles</h2>
    <ul>
      <li><strong>Independence:</strong> we decide what to publish and when.</li>
      <li><strong>Openness:</strong> every figure comes with its method and source.</li>
      <li><strong>Accuracy:</strong> we revise openly when the data improves.</li>
    </ul>
    <h2>Contact</h2>
    <p>Meridia National Statistics Office, 14 Census Square, Aldgate,
    Meridia. Email
    <span class="mono">info@statistics.meridia.example</span>.</p>
  </section>`;
}

export function notFoundPage() {
  return `
  <h1>Page not found</h1>
  <p>There is no statistics page at this address.</p>
  <p><a href="#/">Back to the overview</a></p>`;
}

// Router and controls for the Meridia statistics site. Hash routes pick
// a page, the page renders from data.js, then the canvases on it are
// drawn. Controls re-render the page in place: the year selector, the
// region selector, the dataset search, sortable table headers and the
// line/bar toggle all do what they say, with no page reload.
//
//   #/                overview
//   #/population      population
//   #/economy         economy
//   #/labour          labour
//   #/prices          prices
//   #/regions         regions
//   #/releases        releases
//   #/datasets        datasets
//   #/methods         methods
//   #/about           about
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import {
  YEARS, LATEST, population, economy, labour, prices, regions, education,
} from './data.js';
import { drawLine, drawBars, drawDonut } from './charts.js';
import {
  NAV, overview, populationPage, economyPage, labourPage, pricesPage,
  regionsPage, releasesPage, datasetsPage, methodsPage, aboutPage,
  notFoundPage,
} from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

// State that survives re-renders within the visit.
const state = {
  year: LATEST,
  chartType: 'line',
  sortKey: 'population',
  sortDir: 'desc',
  region: 'Central',
  search: '',
};

function drawCharts() {
  const byId = (id) => document.getElementById(id);
  const popChart = byId('chart-population');
  if (popChart) {
    const values = YEARS.map((y) => population.total[y]);
    if (popChart.dataset.charttype === 'bars') {
      drawBars(popChart, YEARS, values, { unit: 'm', color: '#0f6fb2' });
    } else {
      drawLine(popChart, YEARS, values, { unit: 'm', color: '#0f6fb2' });
    }
  }
  const sectors = byId('chart-sectors');
  if (sectors) drawDonut(sectors, economy.sectors.map((s) => ({ value: s.share })));
  const age = byId('chart-age');
  if (age) {
    drawBars(age, population.ageStructure.map((a) => a.group.replace(' years', '')),
      population.ageStructure.map((a) => a.share), { unit: '%', color: '#0e8a7b' });
  }
  const gdp = byId('chart-gdp');
  if (gdp) drawBars(gdp, YEARS, YEARS.map((y) => economy.gdp[y]), { unit: 'bn', color: '#0f6fb2' });
  const unemp = byId('chart-unemployment');
  if (unemp) drawLine(unemp, YEARS, YEARS.map((y) => labour.unemployment[y]), { unit: '%', color: '#c14b6a' });
  const empSector = byId('chart-empsector');
  if (empSector) drawDonut(empSector, labour.employmentBySector.map((s) => ({ value: s.share })));
  const cpi = byId('chart-cpi');
  if (cpi) drawLine(cpi, YEARS, YEARS.map((y) => prices.cpi[y]), { unit: '%', color: '#d98a16' });
  const basket = byId('chart-basket');
  if (basket) drawDonut(basket, prices.basket.map((b) => ({ value: b.weight })));
  const attainment = byId('chart-attainment');
  if (attainment) {
    drawBars(attainment, education.attainment.map((a) => a.level),
      education.attainment.map((a) => a.share), { unit: '%', color: '#6a5fb0' });
  }
}

function currentRoute() {
  const hash = location.hash || '#/';
  return hash.replace(/^#/, '') || '/';
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  const pages = {
    '/': () => overview(state.year),
    '/population': () => populationPage(state.year, state.chartType),
    '/economy': () => economyPage(state.year),
    '/labour': () => labourPage(state.year),
    '/prices': () => pricesPage(state.year),
    '/regions': () => regionsPage(state.sortKey, state.sortDir, state.region),
    '/releases': () => releasesPage(),
    '/datasets': () => datasetsPage(state.search),
    '/methods': () => methodsPage(),
    '/about': () => aboutPage(),
  };
  const renderPage = pages[route] || notFoundPage;
  app.innerHTML = renderPage();
  const titles = {
    '/': 'Meridia National Statistics Office',
    '/population': 'Population',
    '/economy': 'Economy',
    '/labour': 'Labour',
    '/prices': 'Prices',
    '/regions': 'Regions',
    '/releases': 'Releases',
    '/datasets': 'Datasets',
    '/methods': 'Methods',
    '/about': 'About the Office',
  };
  const title = titles[route] || 'Page not found';
  document.title = route === '/' ? titles['/'] : `${title} | Meridia National Statistics Office`;
  nav.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === `#${route}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  drawCharts();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// One delegated listener: every control on every page reports here.
document.addEventListener('change', (event) => {
  const control = event.target.closest('[data-control]');
  if (!control) return;
  if (control.dataset.control === 'year') {
    const year = Number(control.value);
    if (YEARS.includes(year)) state.year = year;
  }
  if (control.dataset.control === 'region') state.region = control.value;
  if (control.dataset.control === 'search') state.search = control.value;
  render();
});

let searchTimer = null;
document.addEventListener('input', (event) => {
  const control = event.target.closest('[data-control="search"]');
  if (!control) return;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = control.value;
    render();
    const again = document.getElementById('dataset-search');
    if (again) {
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    }
  }, 250);
});

document.addEventListener('click', (event) => {
  const sortButton = event.target.closest('[data-sort]');
  if (sortButton) {
    const key = sortButton.dataset.sort;
    if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    else {
      state.sortKey = key;
      state.sortDir = key === 'name' ? 'asc' : 'desc';
    }
    render();
    return;
  }
  const controlButton = event.target.closest('[data-control]');
  if (!controlButton) return;
  if (controlButton.dataset.control === 'charttype') {
    state.chartType = controlButton.dataset.value;
    render();
  }
  if (controlButton.dataset.control === 'clear-search') {
    state.search = '';
    render();
  }
});

window.addEventListener('hashchange', render);
render();

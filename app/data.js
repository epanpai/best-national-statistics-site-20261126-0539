// Meridia in figures. Every series is the Meridia National Statistics
// Office's own published series for the fictional country of Meridia.
// Figures are internally consistent across pages; each page names the
// source series and the reference year beside the figure it shows.

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
export const LATEST = 2025;
export const SOURCE = 'Meridia National Statistics Office';
export const CURRENCY = 'M$';

export const population = {
  // Total resident population at 1 January, millions.
  total: { 2020: 8.02, 2021: 8.11, 2022: 8.19, 2023: 8.27, 2024: 8.35, 2025: 8.42 },
  // Births and deaths in the year, thousands.
  births: { 2020: 86.4, 2021: 88.1, 2022: 89.3, 2023: 90.2, 2024: 91.0, 2025: 91.8 },
  deaths: { 2020: 71.2, 2021: 70.6, 2022: 69.8, 2023: 69.1, 2024: 68.4, 2025: 67.9 },
  // Net migration in the year, thousands.
  netMigration: { 2020: 12.1, 2021: 18.4, 2022: 24.6, 2023: 28.3, 2024: 31.5, 2025: 33.2 },
  medianAge: { 2020: 41.2, 2021: 41.5, 2022: 41.8, 2023: 42.1, 2024: 42.4, 2025: 42.6 },
  lifeExpectancy: { 2020: 80.1, 2021: 80.4, 2022: 80.7, 2023: 81.0, 2024: 81.2, 2025: 81.4 },
  // Age structure in the latest year, percent of population.
  ageStructure: [
    { group: '0–14 years', share: 16.8 },
    { group: '15–24 years', share: 11.9 },
    { group: '25–54 years', share: 41.2 },
    { group: '55–64 years', share: 13.7 },
    { group: '65 years and over', share: 16.4 },
  ],
};

export const economy = {
  // Gross domestic product at current prices, billion M$.
  gdp: { 2020: 412, 2021: 438, 2022: 471, 2023: 498, 2024: 527, 2025: 556 },
  // Real GDP growth on the previous year, percent.
  gdpGrowth: { 2020: -2.1, 2021: 4.8, 2022: 5.2, 2023: 3.1, 2024: 3.6, 2025: 3.4 },
  // GDP per capita at current prices, M$.
  gdpPerCapita: { 2020: 51370, 2021: 54010, 2022: 57510, 2023: 60220, 2024: 63110, 2025: 66030 },
  // Exports and imports of goods and services, billion M$.
  exports: { 2020: 148, 2021: 167, 2022: 189, 2023: 201, 2024: 214, 2025: 228 },
  imports: { 2020: 141, 2021: 158, 2022: 179, 2023: 190, 2024: 201, 2025: 212 },
  // Gross value added by sector in the latest year, percent of GDP.
  sectors: [
    { name: 'Services', share: 68.4 },
    { name: 'Industry', share: 21.7 },
    { name: 'Construction', share: 5.8 },
    { name: 'Agriculture', share: 4.1 },
  ],
  // Largest export goods in the latest year, billion M$.
  topExports: [
    { good: 'Machinery and equipment', value: 61.4 },
    { good: 'Pharmaceuticals', value: 38.9 },
    { good: 'Food and beverages', value: 34.2 },
    { good: 'Chemicals', value: 29.7 },
    { good: 'Timber and paper', value: 18.6 },
  ],
};

export const labour = {
  // Unemployment rate, percent of the labour force.
  unemployment: { 2020: 7.8, 2021: 6.9, 2022: 5.8, 2023: 5.2, 2024: 4.9, 2025: 4.6 },
  // Employment rate, percent of people aged 15–64.
  employmentRate: { 2020: 71.4, 2021: 72.8, 2022: 74.1, 2023: 75.0, 2024: 75.6, 2025: 76.2 },
  // Median gross monthly wage, M$.
  medianWage: { 2020: 3480, 2021: 3620, 2022: 3840, 2023: 4020, 2024: 4150, 2025: 4280 },
  // Employment by sector in the latest year, percent of all jobs.
  employmentBySector: [
    { name: 'Services', share: 74.2 },
    { name: 'Industry', share: 17.9 },
    { name: 'Construction', share: 4.3 },
    { name: 'Agriculture', share: 3.6 },
  ],
  // Unemployment by age group in the latest year, percent.
  unemploymentByAge: [
    { group: '15–24 years', rate: 11.8 },
    { group: '25–54 years', rate: 4.1 },
    { group: '55–64 years', rate: 3.4 },
  ],
};

export const prices = {
  // Consumer price inflation, annual average, percent.
  cpi: { 2020: 1.2, 2021: 2.4, 2022: 6.1, 2023: 4.3, 2024: 2.8, 2025: 2.3 },
  // CPI basket weights in the latest year, percent.
  basket: [
    { item: 'Housing and utilities', weight: 28.4 },
    { item: 'Food and non-alcoholic drinks', weight: 19.7 },
    { item: 'Transport', weight: 14.2 },
    { item: 'Recreation and culture', weight: 9.8 },
    { item: 'Health', weight: 8.1 },
    { item: 'Education', weight: 6.3 },
    { item: 'Other goods and services', weight: 13.5 },
  ],
  // Price change by basket item in the latest year, percent.
  changeByItem: [
    { item: 'Housing and utilities', change: 3.1 },
    { item: 'Food and non-alcoholic drinks', change: 2.6 },
    { item: 'Transport', change: 1.4 },
    { item: 'Recreation and culture', change: 1.9 },
    { item: 'Health', change: 2.2 },
    { item: 'Education', change: 3.8 },
    { item: 'Other goods and services', change: 2.0 },
  ],
};

export const regions = [
  { name: 'Central', population: 2.41, gdpPerCapita: 78400, unemployment: 3.9, medianAge: 41.8 },
  { name: 'Southport', population: 1.52, gdpPerCapita: 68900, unemployment: 4.2, medianAge: 42.9 },
  { name: 'Westfield', population: 1.18, gdpPerCapita: 64200, unemployment: 4.5, medianAge: 43.1 },
  { name: 'Coastline', population: 0.94, gdpPerCapita: 61800, unemployment: 4.8, medianAge: 44.0 },
  { name: 'Northvale', population: 0.87, gdpPerCapita: 59700, unemployment: 5.1, medianAge: 43.6 },
  { name: 'Eastmoor', population: 0.71, gdpPerCapita: 55300, unemployment: 5.6, medianAge: 44.8 },
  { name: 'Lakeside', population: 0.46, gdpPerCapita: 52100, unemployment: 5.9, medianAge: 45.2 },
  { name: 'Highland', population: 0.33, gdpPerCapita: 48600, unemployment: 6.4, medianAge: 46.1 },
];

export const releases = [
  { date: '2026-11-24', title: 'Consumer price index, October 2026', topic: 'Prices' },
  { date: '2026-11-18', title: 'Labour force survey, Q3 2026', topic: 'Labour' },
  { date: '2026-11-11', title: 'Regional GDP, 2025 (revised)', topic: 'Economy' },
  { date: '2026-11-04', title: 'Population estimate, 1 January 2026', topic: 'Population' },
  { date: '2026-10-28', title: 'Foreign trade, September 2026', topic: 'Economy' },
  { date: '2026-10-21', title: 'Household income and living conditions, 2025', topic: 'Society' },
  { date: '2026-10-14', title: 'Education outcomes, school year 2025–26', topic: 'Education' },
  { date: '2026-10-07', title: 'Consumer price index, September 2026', topic: 'Prices' },
];

export const datasets = [
  { name: 'Population by year and age group', topic: 'Population', years: '2015–2025', rows: '11 × 18', file: 'population.csv', updated: '2026-11-04' },
  { name: 'GDP and GDP per capita by year', topic: 'Economy', years: '2015–2025', rows: '11 × 6', file: 'gdp.csv', updated: '2026-11-11' },
  { name: 'Unemployment and employment rates', topic: 'Labour', years: '2015–2025', rows: '11 × 5', file: 'labour.csv', updated: '2026-11-18' },
  { name: 'Consumer prices by basket item', topic: 'Prices', years: '2015–2025', rows: '11 × 8', file: 'prices.csv', updated: '2026-11-24' },
  { name: 'Regional indicators', topic: 'Regions', years: '2020–2025', rows: '6 × 8', file: 'regions.csv', updated: '2026-11-11' },
];

export const education = {
  // Share of people aged 25–64 with each level as their highest, latest year.
  attainment: [
    { level: 'Tertiary', share: 42.6 },
    { level: 'Upper secondary', share: 38.9 },
    { level: 'Lower secondary', share: 12.4 },
    { level: 'Primary or less', share: 6.1 },
  ],
  schoolLeavers: { 2020: 8.9, 2021: 8.4, 2022: 7.8, 2023: 7.3, 2024: 6.9, 2025: 6.5 },
};

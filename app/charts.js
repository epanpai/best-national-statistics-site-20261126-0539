// Small canvas chart helpers. No library: every chart is drawn from the
// site's own data with the 2D canvas API, so the first load stays tiny.
// Each draw function takes a <canvas> element and plain data; the page
// calls them again whenever a control (year, region, chart type) changes.

const INK = '#17324f';
const GRID = '#dbe4ec';
const BLUE = '#0f6fb2';
const TEAL = '#0e8a7b';
const AMBER = '#d98a16';
const ROSE = '#c14b6a';
const SLATE = '#5b7186';
export const PALETTE = [BLUE, TEAL, AMBER, ROSE, '#6a5fb0', '#3f7d4e', '#8a6d3b', SLATE];

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = '12px system-ui, sans-serif';
  return { ctx, width, height };
}

function niceMax(value) {
  const power = 10 ** Math.floor(Math.log10(value));
  const scaled = value / power;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return nice * power;
}

function axes(ctx, box, yMax, yLabel) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = SLATE;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const y = box.y + box.h - (box.h * i) / steps;
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.w, y);
    ctx.stroke();
    const value = (yMax * i) / steps;
    ctx.fillText(value >= 100 ? String(Math.round(value)) : value.toFixed(1), box.x - 8, y);
  }
  // The unit is named in the chart heading and in the endpoint value
  // labels, so no rotated axis label is drawn: it only adds clutter.
  ctx.strokeStyle = '#9fb2c2';
  ctx.beginPath();
  ctx.moveTo(box.x, box.y + box.h);
  ctx.lineTo(box.x + box.w, box.y + box.h);
  ctx.stroke();
}

// Line chart: labels are years, values are numbers, unit is shown on the
// y axis and in the value labels of the first and last points.
export function drawLine(canvas, labels, values, { unit = '', color = BLUE, height = 260 } = {}) {
  const { ctx, width, height: h } = setup(canvas, height);
  const box = { x: 52, y: 14, w: width - 64, h: h - 48 };
  const max = niceMax(Math.max(...values) * 1.08);
  axes(ctx, box, max, unit);
  const point = (i) => ({
    x: box.x + (box.w * i) / (labels.length - 1),
    y: box.y + box.h - (box.h * values[i]) / max,
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  labels.forEach((_, i) => {
    const p = point(i);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.fillStyle = color;
  labels.forEach((_, i) => {
    const p = point(i);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  labels.forEach((label, i) => ctx.fillText(String(label), point(i).x, box.y + box.h + 8));
  ctx.font = 'bold 12px system-ui, sans-serif';
  [0, labels.length - 1].forEach((i) => {
    const p = point(i);
    // Anchor the first label to the left edge and the last to the right
    // edge so neither is clipped by the canvas.
    ctx.textAlign = i === 0 ? 'left' : 'right';
    ctx.fillText(`${values[i]}${unit ? ` ${unit}` : ''}`, p.x, Math.max(0, p.y - 20));
  });
  ctx.font = '12px system-ui, sans-serif';
}

// Vertical bar chart with a value label on top of each bar.
export function drawBars(canvas, labels, values, { unit = '', color = BLUE, height = 260 } = {}) {
  const { ctx, width, height: h } = setup(canvas, height);
  const box = { x: 52, y: 14, w: width - 64, h: h - 48 };
  const max = niceMax(Math.max(...values) * 1.1);
  axes(ctx, box, max, unit);
  const slot = box.w / labels.length;
  const barWidth = Math.min(46, slot * 0.62);
  labels.forEach((label, i) => {
    const barH = (box.h * values[i]) / max;
    const x = box.x + slot * i + (slot - barWidth) / 2;
    const y = box.y + box.h - barH;
    ctx.fillStyle = Array.isArray(color) ? color[i % color.length] : color;
    ctx.fillRect(x, y, barWidth, barH);
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(String(values[i]), x + barWidth / 2, y - 4);
    ctx.textBaseline = 'top';
    ctx.fillStyle = SLATE;
    ctx.fillText(String(label), x + barWidth / 2, box.y + box.h + 8);
  });
}

// Donut chart: slices with a legend drawn beside them in HTML by the page.
export function drawDonut(canvas, slices, { height = 220 } = {}) {
  const { ctx, width, height: h } = setup(canvas, height);
  const cx = width / 2;
  const cy = h / 2;
  const radius = Math.min(width, h) / 2 - 18;
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let start = -Math.PI / 2;
  slices.forEach((slice, i) => {
    const angle = (slice.value / total) * Math.PI * 2;
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, start + angle);
    ctx.closePath();
    ctx.fill();
    start += angle;
  });
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100%', cx, cy - 8);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = SLATE;
  ctx.fillText('of GDP', cx, cy + 10);
}

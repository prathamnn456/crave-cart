import React, { useState } from 'react'
import './RevenueChart.css'

const W = 340, H = 130, PAD_X = 10, PAD_TOP = 14, PAD_BOT = 22;

// smooth cubic path (François Romain technique)
const lineProps = (a, b) => ({ length: Math.hypot(b.x - a.x, b.y - a.y), angle: Math.atan2(b.y - a.y, b.x - a.x) });
const control = (cur, prev, next, reverse) => {
  const p = prev || cur, n = next || cur;
  const o = lineProps(p, n);
  const angle = o.angle + (reverse ? Math.PI : 0);
  const len = o.length * 0.18;
  return [cur.x + Math.cos(angle) * len, cur.y + Math.sin(angle) * len];
};
const smoothPath = (pts) => pts.reduce((acc, pt, i, a) => {
  if (i === 0) return `M ${pt.x},${pt.y}`;
  const [c1x, c1y] = control(a[i - 1], a[i - 2], pt);
  const [c2x, c2y] = control(pt, a[i - 1], a[i + 1], true);
  return `${acc} C ${c1x},${c1y} ${c2x},${c2y} ${pt.x},${pt.y}`;
}, '');

const RevenueChart = ({ days, currency = '₹' }) => {
  const [hover, setHover] = useState(null);
  const max = Math.max(...days.map(d => d.total), 1);
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOT;

  const pts = days.map((d, i) => ({
    x: PAD_X + (days.length === 1 ? innerW / 2 : (i / (days.length - 1)) * innerW),
    y: PAD_TOP + innerH - (d.total / max) * innerH,
    ...d,
  }));

  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${PAD_TOP + innerH} L ${pts[0].x},${PAD_TOP + innerH} Z`;

  return (
    <div className='rev-chart'>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio='none' onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id='revfill' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='var(--accent)' stopOpacity='0.32' />
            <stop offset='100%' stopColor='var(--accent)' stopOpacity='0' />
          </linearGradient>
        </defs>

        {/* faint gridlines */}
        {[0.25, 0.5, 0.75].map((g, i) => (
          <line key={i} x1={PAD_X} x2={W - PAD_X} y1={PAD_TOP + innerH * g} y2={PAD_TOP + innerH * g}
            stroke='var(--border)' strokeWidth='1' strokeDasharray='3 4' />
        ))}

        <path d={areaPath} fill='url(#revfill)' />
        <path d={linePath} fill='none' stroke='var(--accent)' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' vectorEffect='non-scaling-stroke' />

        {/* points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hover === i ? 4.5 : 3}
            fill='var(--surface)' stroke='var(--accent)' strokeWidth='2' vectorEffect='non-scaling-stroke' />
        ))}

        {hover != null && (
          <line x1={pts[hover].x} x2={pts[hover].x} y1={PAD_TOP} y2={PAD_TOP + innerH}
            stroke='var(--accent)' strokeWidth='1' strokeDasharray='3 3' vectorEffect='non-scaling-stroke' />
        )}

        {/* hover hit-areas */}
        {pts.map((p, i) => {
          const bw = innerW / days.length;
          return <rect key={i} x={p.x - bw / 2} y={0} width={bw} height={H} fill='transparent'
            onMouseEnter={() => setHover(i)} />;
        })}

        {/* x labels */}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 6} textAnchor='middle' fontSize='9' fill='var(--ink-3)'>{p.label}</text>
        ))}
      </svg>

      {hover != null && (
        <div className='rev-tip' style={{ left: `${(pts[hover].x / W) * 100}%`, top: `${(pts[hover].y / H) * 100}%` }}>
          <b>{currency}{days[hover].total.toLocaleString('en-IN')}</b>
          <span>{days[hover].label}</span>
        </div>
      )}
    </div>
  )
}

export default RevenueChart

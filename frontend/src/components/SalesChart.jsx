import React, { useMemo } from 'react';

export default function SalesChart({ data }) {
  const width = 720;
  const height = 220;
  const padL = 40, padR = 12, padT = 20, padB = 28;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const max = 1000;

  const { path, area, points } = useMemo(() => {
    const step = w / (data.length - 1);
    const pts = data.map((d, i) => ({
      x: padL + i * step,
      y: padT + h - (d.v / max) * h,
      ...d,
    }));
    const line = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
    const areaPath = `${line} L${pts[pts.length - 1].x},${padT + h} L${pts[0].x},${padT + h} Z`;
    return { path: line, area: areaPath, points: pts };
  }, [data]);

  const yTicks = [0, 250, 500, 750, 1000];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[240px]">
      <defs>
        <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t) => {
        const y = padT + h - (t / max) * h;
        return (
          <g key={t}>
            <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#26221f" strokeDasharray="2 4" />
            <text x={padL - 10} y={y + 4} textAnchor="end" fill="#6b6560" fontSize="11">{t}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#salesFill)" />
      <path d={path} stroke="#f97316" strokeWidth="2" fill="none" />
      {points.map((p) => (
        <g key={p.day}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#0f0f10" stroke="#f97316" strokeWidth="2" />
          <text x={p.x} y={height - 8} textAnchor="middle" fill="#8a827c" fontSize="11">{p.day}</text>
        </g>
      ))}
    </svg>
  );
}

import React from 'react';

export function Panel({ title, right, className = '', children }) {
  return (
    <div className={`rounded-xl subtle-card p-6 ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between mb-4">
          {title && <div className="font-serif text-[20px] text-neutral-100">{title}</div>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint, Icon }) {
  return (
    <div className="rounded-xl subtle-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.22em] text-neutral-500">{label}</div>
        {Icon && <Icon className="w-4 h-4 text-orange-500" strokeWidth={1.6} />}
      </div>
      <div className="font-serif text-[30px] mt-3 text-neutral-100">{value}</div>
      <div className="text-[12px] text-neutral-500 mt-1">{hint}</div>
    </div>
  );
}

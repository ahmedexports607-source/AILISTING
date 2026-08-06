import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Panel } from '../components/Panel';
import SalesChart from '../components/SalesChart';
import { weeklySales } from '../mock/mockData';

export default function Reports() {
  const items = [
    { title: 'Weekly evening report', date: 'Thursday, August 8', summary: 'Revenue up 12%. 3 listings approved, 2 pending. Inventory alerts on 4 SKUs.' },
    { title: 'Weekly evening report', date: 'Wednesday, August 7', summary: 'Table runners driving 41% of conversion this week. Instagram post pending.' },
    { title: 'Weekly evening report', date: 'Tuesday, August 6', summary: 'Restock draft prepared for teak block set. 6 support replies drafted.' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Reports</h1>
          <p className="text-neutral-500 mt-1">Every evening at 7pm, a plain-English summary of what changed.</p>
        </div>
      </div>

      <Panel title="Weekly Sales">
        <SalesChart data={weeklySales} />
      </Panel>

      <div className="space-y-3">
        {items.map((i, idx) => (
          <div key={`report-${i.title}-${idx}`} className="rounded-xl subtle-card p-5">
            <div className="flex items-center justify-between">
              <div className="font-serif text-lg text-neutral-100">{i.title}</div>
              <div className="text-[11px] tracking-[0.18em] text-neutral-500">{i.date}</div>
            </div>
            <div className="text-[13px] text-neutral-400 mt-2">{i.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

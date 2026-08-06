import React from 'react';
import { DollarSign, Mail, Users, LineChart, Sun, Moon, TrendingUp, AlertTriangle, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Panel, StatCard } from '../components/Panel';
import SalesChart from '../components/SalesChart';
import { Link } from 'react-router-dom';
import { stats, weeklySales, aiStatus, pendingWork, inventoryAlerts, trendingKeywords, products } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const iconMap = { DollarSign, Mail, Users, LineChart };

export default function Dashboard() {
  const { toast } = useToast();
  const topProducts = products.slice(0, 5);
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-[42px] leading-tight text-neutral-100">Good day, let's grow sales.</h1>
          <p className="text-neutral-500 mt-2">Your AI team is working in the background. Approve what matters.</p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-[0_6px_18px_-6px_rgba(249,115,22,0.7)]"
            onClick={() => toast({ title: 'Morning Plan generated', description: 'Priorities and drafts are ready for your review.' })}
          >
            <Sun className="w-4 h-4" /> Morning Plan
          </Button>
          <Button
            variant="outline"
            className="gap-2 bg-transparent border-white/10 text-neutral-200 hover:bg-white/5"
            onClick={() => toast({ title: 'Evening report queued', description: 'You will get it at 7:00 PM.' })}
          >
            <Moon className="w-4 h-4" /> Evening Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} Icon={iconMap[s.icon]} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel
          className="xl:col-span-2"
          title="Weekly Sales"
          right={
            <div className="flex items-center gap-1 text-[11px] tracking-[0.18em] text-orange-500">
              <TrendingUp className="w-3.5 h-3.5" /> TRENDING UP
            </div>
          }
        >
          <SalesChart data={weeklySales} />
        </Panel>
        <Panel title="AI Working Status">
          <ul className="space-y-3">
            {aiStatus.map((s, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 pulse-dot" />
                <div className="text-[13px] leading-snug">
                  <span className="text-orange-400">{s.tag}</span>
                  <span className="text-neutral-300"> — {s.text}</span>
                  {s.sub && <div className="text-neutral-500 text-[12px] mt-0.5">{s.sub}</div>}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Panel title="Pending Work">
          <ul className="space-y-3">
            {pendingWork.map((t, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-3 text-[13px] text-neutral-300 cursor-pointer">
                  <Checkbox className="border-neutral-600" />
                  <span>{t.title}</span>
                </label>
                <span className={`text-[10px] tracking-[0.18em] ${t.level === 'HIGH' ? 'text-orange-500' : t.level === 'MEDIUM' ? 'text-amber-400' : 'text-neutral-500'}`}>{t.level}</span>
              </li>
            ))}
          </ul>
          <Link to="/tasks" className="inline-block mt-4 text-[13px] text-orange-500 hover:text-orange-400">View all tasks →</Link>
        </Panel>

        <Panel title={<span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" />Inventory Alerts</span>}>
          <ul className="space-y-3">
            {inventoryAlerts.map((a, i) => (
              <li key={i} className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-300">{a.name}</span>
                <span className={`text-[11px] ${a.left === 0 ? 'text-red-400' : 'text-orange-500'}`}>{a.left} left</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={<span className="flex items-center gap-2"><Search className="w-4 h-4 text-orange-500" />Trending Keywords</span>}>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((k) => (
              <span key={k} className="px-3 py-1.5 rounded-full text-[12px] bg-white/[0.03] border border-white/[0.06] text-neutral-300 hover:border-orange-500/40 transition-colors cursor-default">{k}</span>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Top Products">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[10px] tracking-[0.22em] text-neutral-500">
                <th className="text-left font-normal pb-3">PRODUCT</th>
                <th className="text-left font-normal pb-3">CATEGORY</th>
                <th className="text-right font-normal pb-3">PRICE</th>
                <th className="text-right font-normal pb-3">STOCK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {topProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 text-neutral-200">{p.name}</td>
                  <td className="py-3 text-neutral-400">{p.category.charAt(0) + p.category.slice(1).toLowerCase()}</td>
                  <td className="py-3 text-right text-neutral-200">${p.price}</td>
                  <td className={`py-3 text-right ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-orange-500' : 'text-neutral-300'}`}>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

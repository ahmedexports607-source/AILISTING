import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sparkles, LayoutGrid, Wand2, Package, FileText, ListChecks, Rocket, BarChart3, Plug, Brain, Crown, Search, Tag, PenTool, Megaphone, MessageCircle, Compass, TrendingUp, LineChart, Boxes, Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { notifications } from '../mock/mockData';

const workspace = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/magic', label: 'Magic Listing', icon: Wand2 },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/studio', label: 'Drafts & Studio', icon: FileText },
  { to: '/tasks', label: 'Task Manager', icon: ListChecks },
  { to: '/autopilot', label: 'Autopilot', icon: Rocket },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/memory', label: 'AI Memory', icon: Brain },
];

const departments = [
  { to: '/agent/ceo', label: 'CEO Agent', icon: Crown },
  { to: '/agent/seo', label: 'SEO Expert', icon: Search },
  { to: '/agent/listing', label: 'Listing Expert', icon: Tag },
  { to: '/agent/designer', label: 'Graphic Designer', icon: PenTool },
  { to: '/agent/marketing', label: 'Marketing Expert', icon: Megaphone },
  { to: '/agent/support', label: 'Customer Support', icon: MessageCircle },
  { to: '/agent/research', label: 'Research Agent', icon: Compass },
  { to: '/agent/sales', label: 'Sales Agent', icon: TrendingUp },
  { to: '/agent/analytics', label: 'Analytics Agent', icon: LineChart },
  { to: '/agent/inventory', label: 'Inventory Manager', icon: Boxes },
  { to: '/agent/task', label: 'Task Manager', icon: ListChecks },
];

function Item({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors ${
          isActive
            ? 'bg-[#1a1613] text-orange-400 border-l-2 border-orange-500 pl-[10px]'
            : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.03]'
        }`
      }
    >
      <Icon className="w-4 h-4" strokeWidth={1.6} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const location = useLocation();
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div className="flex min-h-screen bg-[#0f0f10] text-neutral-200">
      {/* Sidebar */}
      <aside className="w-[210px] shrink-0 border-r border-white/[0.06] bg-[#0c0b0b] flex flex-col">
        <Link to="/" className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_6px_20px_-8px_rgba(249,115,22,0.7)]">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[17px] text-neutral-100">AI Employee</div>
            <div className="text-[9px] tracking-[0.18em] text-orange-500 font-medium">ALWAYS WORKING</div>
          </div>
        </Link>

        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[10px] tracking-[0.22em] text-neutral-500">WORKSPACE</div>
          <nav className="flex flex-col gap-0.5">
            {workspace.map((i) => (
              <Item key={i.to} {...i} />
            ))}
          </nav>

          <div className="px-3 pt-6 pb-2 text-[10px] tracking-[0.22em] text-neutral-500">DEPARTMENTS</div>
          <nav className="flex flex-col gap-0.5">
            {departments.map((i) => (
              <Item key={i.to} {...i} />
            ))}
          </nav>
        </div>

        <div className="mt-auto px-4 py-3 border-t border-white/[0.06] text-[11px] text-neutral-500 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
          11 agents online · 24/7
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between px-10 py-5 border-b border-white/[0.06] sticky top-0 bg-[#0f0f10]/85 backdrop-blur z-10">
          <div>
            <div className="font-serif text-[22px] text-neutral-100 leading-none">Command Center</div>
            <div className="text-[12px] text-neutral-500 mt-1">{today}</div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:border-white/20 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-orange-500 text-[10px] text-white font-medium flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 bg-[#141110] border-white/[0.08] text-neutral-200">
              <div className="font-serif text-lg mb-2">Notifications</div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-md bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-sm">{n.title}</div>
                    <div className="text-[11px] text-neutral-500 mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </header>
        <div key={location.pathname} className="px-10 py-8 fade-up">{children}</div>
      </main>
    </div>
  );
}

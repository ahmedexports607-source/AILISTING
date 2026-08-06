import React, { useState } from 'react';
import { Plug, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { integrations as seed } from '../mock/mockData';

export default function Integrations() {
  const [items, setItems] = useState(seed);
  const toggle = (name) => setItems((prev) => prev.map((i) => i.name === name ? { ...i, connected: !i.connected } : i));
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <Plug className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Integrations</h1>
          <p className="text-neutral-500 mt-1">Wire up the tools your AI team should use for you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.name} className="rounded-xl subtle-card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-serif text-neutral-200">{i.initial}</div>
              <div>
                <div className="font-serif text-lg text-neutral-100">{i.name}</div>
                <div className="text-[11px] tracking-[0.18em] text-neutral-500 mt-0.5">{i.connected ? 'CONNECTED' : 'NOT CONNECTED'}</div>
              </div>
            </div>
            <div className="text-[13px] text-neutral-400 mt-3 min-h-[42px]">{i.desc}</div>
            <Button
              onClick={() => toggle(i.name)}
              variant={i.connected ? 'outline' : 'default'}
              className={i.connected ? 'w-full mt-4 gap-2 bg-transparent border-white/10 text-neutral-200 hover:bg-white/5' : 'w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white'}
            >
              {i.connected ? <><Check className="w-4 h-4" /> Connected</> : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

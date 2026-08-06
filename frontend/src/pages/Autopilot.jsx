import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { autopilotRules } from '../mock/mockData';

export default function Autopilot() {
  const [rules, setRules] = useState(autopilotRules);
  const toggle = (id) => setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Autopilot</h1>
          <p className="text-neutral-500 mt-1">Rules your AI team follows without asking — keep them tight, keep them useful.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((r) => (
          <div key={r.id} className="rounded-xl subtle-card p-5 flex items-start gap-4">
            <div className="flex-1">
              <div className="font-serif text-lg text-neutral-100">{r.name}</div>
              <div className="text-[13px] text-neutral-500 mt-1">{r.desc}</div>
            </div>
            <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} className="data-[state=checked]:bg-orange-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, ListChecks } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { tasks as seed } from '../mock/mockData';

export default function TaskManager() {
  const [items, setItems] = useState(seed);
  const [title, setTitle] = useState('');

  const toggle = (id) => setItems((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const add = () => {
    if (!title.trim()) return;
    setItems((prev) => [{ id: `t${Date.now()}`, title, assignee: 'Task Manager', due: 'Today', level: 'MEDIUM', done: false }, ...prev]);
    setTitle('');
  };

  const groups = [
    { key: 'HIGH', label: 'High priority' },
    { key: 'MEDIUM', label: 'Medium' },
    { key: 'LOW', label: 'Low' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <ListChecks className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Task Manager</h1>
          <p className="text-neutral-500 mt-1">Everything the team is working on, and what needs your approval.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task and press enter" onKeyDown={(e) => e.key === 'Enter' && add()} className="bg-white/[0.03] border-white/10 text-neutral-200" />
        <Button onClick={add} className="bg-orange-500 hover:bg-orange-600 gap-2"><Plus className="w-4 h-4" />Add</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <div key={g.key} className="rounded-xl subtle-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-serif text-lg text-neutral-100">{g.label}</div>
              <div className="text-[10px] tracking-[0.22em] text-neutral-500">{items.filter((t) => t.level === g.key).length} TASKS</div>
            </div>
            <ul className="space-y-3">
              {items.filter((t) => t.level === g.key).map((t) => (
                <li key={t.id} className="flex items-start gap-3">
                  <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} className="border-neutral-600 mt-0.5" />
                  <div className="flex-1">
                    <div className={`text-[13px] ${t.done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>{t.title}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{t.assignee} · due {t.due}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

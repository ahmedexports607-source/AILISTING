import React, { useState } from 'react';
import { Brain, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { memoryNotes } from '../mock/mockData';

export default function AIMemory() {
  const [items, setItems] = useState(memoryNotes);
  const [tag, setTag] = useState('');
  const [text, setText] = useState('');

  const add = () => {
    if (!tag || !text) return;
    setItems((prev) => [{ tag, text }, ...prev]);
    setTag(''); setText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <Brain className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">AI Memory</h1>
          <p className="text-neutral-500 mt-1">Long-term facts your team never forgets. Brand voice, rules, do-not-uses.</p>
        </div>
      </div>

      <div className="rounded-xl subtle-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3">
          <Input placeholder="Tag (e.g. Brand voice)" value={tag} onChange={(e) => setTag(e.target.value)} className="bg-white/[0.03] border-white/10" />
          <Input placeholder="What should your team remember?" value={text} onChange={(e) => setText(e.target.value)} className="bg-white/[0.03] border-white/10" />
          <Button onClick={add} className="bg-orange-500 hover:bg-orange-600 gap-2"><Plus className="w-4 h-4" />Add memory</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((m, i) => (
          <div key={i} className="rounded-xl subtle-card p-5">
            <div className="text-[10px] tracking-[0.22em] text-orange-500">{m.tag.toUpperCase()}</div>
            <div className="font-serif text-[17px] mt-2 text-neutral-100 leading-snug">{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

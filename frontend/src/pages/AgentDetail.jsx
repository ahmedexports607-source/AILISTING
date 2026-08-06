import React, { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { agents } from '../mock/mockData';

const openers = {
  ceo: "Here's what I think we should focus on this week. Want me to brief the team?",
  seo: "I found rising keywords for summer collection. Should I re-tag your listings?",
  listing: "I staged 3 listings from your last photo drop. Want to review them?",
  designer: "I sketched 2 Instagram posts for the kaftan drop. Prefer warm or muted palette?",
  marketing: "The 'Monsoon Blues' newsletter is drafted. Want me to schedule for Thursday?",
  support: "6 replies drafted. 2 look tricky — I flagged them for your touch.",
  research: "Pinterest boards trending: 'quiet luxury cotton'. Want a moodboard?",
  sales: "12 wholesale follow-ups sent, 3 replies. Want me to draft next steps?",
  analytics: "Conversion up 0.3%. Table runners are the main driver. Dive deeper?",
  inventory: "4 items low, 1 out of stock. Draft purchase orders?",
  task: "9 tasks in flight, 2 need approval. Should I nudge the team?",
};

export default function AgentDetail() {
  const { slug } = useParams();
  const agent = agents[slug];
  const [messages, setMessages] = useState(() => [
    { role: 'agent', text: openers[slug] || 'How can I help today?' },
  ]);
  const [input, setInput] = useState('');

  const suggestions = useMemo(() => [
    'Give me a plan for this week',
    'What should I approve first?',
    'Draft an update for my team',
  ], []);

  if (!agent) return <Navigate to="/" replace />;

  const send = (text) => {
    const t = text ?? input;
    if (!t.trim()) return;
    setMessages((prev) => [...prev, { role: 'me', text: t }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'agent', text: `On it. I'll take "${t}" and come back with a short plan you can approve.` }]);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">{agent.name}</h1>
          <p className="text-neutral-500 mt-1">{agent.role}</p>
          <div className="text-[11px] tracking-[0.18em] text-orange-500 mt-2">TONE · {agent.tone.toUpperCase()}</div>
        </div>
      </div>

      <div className="rounded-xl subtle-card p-5">
        <div className="text-[11px] tracking-[0.18em] text-neutral-500 mb-2">LAST UPDATE</div>
        <div className="text-neutral-200">{agent.last}</div>
      </div>

      <div className="rounded-xl subtle-card p-5">
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                m.role === 'me'
                  ? 'bg-orange-500 text-white rounded-br-sm'
                  : 'bg-white/[0.04] border border-white/[0.06] text-neutral-200 rounded-bl-sm'
              }`}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-[12px] px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:text-neutral-100 hover:border-orange-500/40 transition-colors">
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={`Message ${agent.name}…`} className="bg-white/[0.03] border-white/10 text-neutral-200" />
          <Button onClick={() => send()} className="bg-orange-500 hover:bg-orange-600 gap-2"><Send className="w-4 h-4" />Send</Button>
        </div>
      </div>
    </div>
  );
}

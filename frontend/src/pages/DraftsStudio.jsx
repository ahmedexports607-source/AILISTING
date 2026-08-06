import React from 'react';
import { FileText, Send, Pencil } from 'lucide-react';
import { Button } from '../components/ui/button';
import { drafts } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

export default function DraftsStudio() {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Drafts & Studio</h1>
        <p className="text-neutral-500 mt-1">Review, tweak and publish everything your AI team has prepared.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drafts.map((d) => (
          <div key={d.id} className="rounded-xl subtle-card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <div className="font-serif text-lg text-neutral-100">{d.title}</div>
                <div className="text-[11px] tracking-[0.18em] text-neutral-500 mt-0.5">{d.status.toUpperCase()} · {d.updated}</div>
              </div>
            </div>
            <div className="mt-4 text-[13px] text-neutral-400 leading-relaxed">
              Preview: A short, sensory description of the piece, followed by material, dimensions and care.
              The story is warm and craft-first — exactly how the brand voice memory instructs.
            </div>
            <div className="flex items-center gap-2 mt-5">
              <Button className="bg-orange-500 hover:bg-orange-600 gap-2" onClick={() => toast({ title: 'Sent to Etsy', description: d.title })}>
                <Send className="w-4 h-4" /> Publish to Etsy
              </Button>
              <Button variant="outline" className="bg-transparent border-white/10 text-neutral-200 hover:bg-white/5 gap-2"><Pencil className="w-4 h-4" />Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

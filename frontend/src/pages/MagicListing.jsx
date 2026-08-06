import React, { useRef, useState } from 'react';
import { Wand2, Upload, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

export default function MagicListing() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  const onFiles = (list) => {
    const arr = Array.from(list).slice(0, 20).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...arr].slice(0, 20));
  };

  const generate = () => {
    if (!files.length) {
      toast({ title: 'Add photos first', description: 'Drop one or many product photos to begin.' });
      return;
    }
    setRunning(true);
    setTimeout(() => {
      const generated = files.map((f) => ({
        id: f.id,
        image: f.url,
        title: 'Hand Block Printed Cotton Textile — Artisan Craft',
        tags: ['block print', 'hand carved', 'cotton', 'artisan', 'indigo', 'natural dye'],
        description: 'A one-of-a-kind textile hand-printed by artisans in Rajasthan. Natural dyes, softly washed cotton, and heirloom motifs — ready to become a statement in your home.',
        price: 24 + Math.floor(Math.random() * 40),
        approved: false,
      }));
      setDrafts(generated);
      setRunning(false);
      toast({ title: 'Drafts staged', description: `${generated.length} listings ready for review.` });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Magic Listing</h1>
          <p className="text-neutral-500 mt-1">Upload one photo — or a whole batch. The AI writes a full listing for each and stages them for Etsy.</p>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className="dashed-border rounded-xl p-10 text-center cursor-pointer hover:bg-orange-500/[0.03] transition-colors"
      >
        <div className="mx-auto w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
          <Upload className="w-5 h-5 text-orange-500" />
        </div>
        <div className="font-serif text-2xl text-neutral-100">Drop product photos</div>
        <div className="text-neutral-500 text-[13px] mt-1">click to browse · select many at once · up to 20 · 8MB each</div>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div className="rounded-xl subtle-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-serif text-xl text-neutral-100">{files.length} photo{files.length > 1 ? 's' : ''} ready</div>
            <Button className="bg-orange-500 hover:bg-orange-600 gap-2" onClick={generate} disabled={running}>
              {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Wand2 className="w-4 h-4" /> Generate listings</>}
            </Button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {files.map((f) => (
              <div key={f.id} className="aspect-square rounded-md overflow-hidden bg-white/[0.03] border border-white/[0.06]">
                <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] p-10 flex flex-col items-center text-center">
          <ImageIcon className="w-6 h-6 text-neutral-600 mb-3" />
          <div className="text-neutral-500 text-[13px]">Drop one or many photos above — each becomes a complete, ready-to-publish listing.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((d) => (
            <div key={d.id} className="rounded-xl subtle-card p-5 flex gap-4">
              <img src={d.image} alt="" className="w-28 h-28 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg text-neutral-100">{d.title}</div>
                <div className="text-neutral-500 text-[12px] mt-1 line-clamp-2">{d.description}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {d.tags.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-neutral-400">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-orange-500 text-sm">${d.price}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 bg-transparent border-white/10 text-neutral-200 hover:bg-white/5"
                    onClick={() => {
                      setDrafts((prev) => prev.map((x) => x.id === d.id ? { ...x, approved: true } : x));
                      toast({ title: 'Approved', description: 'Draft moved to Studio.' });
                    }}
                  >
                    <Check className="w-3.5 h-3.5" /> {d.approved ? 'Approved' : 'Approve'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

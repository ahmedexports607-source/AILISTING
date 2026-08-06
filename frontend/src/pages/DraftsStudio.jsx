import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Send, Pencil, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { drafts as seed } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DraftsStudio() {
  const { toast } = useToast();
  const [connected, setConnected] = useState(null);
  const [busy, setBusy] = useState({});
  const [published, setPublished] = useState({});

  useEffect(() => {
    axios.get(`${API}/etsy/status`).then(r => setConnected(r.data.connected)).catch(() => setConnected(false));
  }, []);

  const publish = async (d) => {
    if (!connected) {
      toast({ title: 'Connect Etsy first', description: 'Head to Integrations and connect your Etsy shop.' });
      return;
    }
    setBusy((b) => ({ ...b, [d.id]: true }));
    try {
      const { data } = await axios.post(`${API}/etsy/publish`, {
        title: d.title,
        description: `A hand-crafted piece — ${d.title}. Preview description created by your AI Employee. Warm, artisan, story-first.`,
        price: 24,
        quantity: 1,
        tags: ['block print', 'hand carved', 'cotton', 'artisan', 'natural dye'],
      });
      setPublished((p) => ({ ...p, [d.id]: data }));
      toast({ title: 'Draft created on Etsy', description: `Listing #${data.listing_id}` });
    } catch (e) {
      const msg = e?.response?.data?.detail || e.message;
      toast({ title: 'Etsy publish failed', description: String(msg).slice(0, 200) });
    } finally {
      setBusy((b) => ({ ...b, [d.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Drafts & Studio</h1>
        <p className="text-neutral-500 mt-1">Review, tweak and publish everything your AI team has prepared.</p>
      </div>

      {connected === false && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.05] p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-serif text-neutral-100">Connect your Etsy shop to publish drafts</div>
            <div className="text-[13px] text-neutral-400 mt-0.5">Right now these drafts stay in Studio. Connect Etsy and one click sends them to your shop as drafts.</div>
          </div>
          <Link to="/integrations"><Button className="bg-orange-500 hover:bg-orange-600">Connect Etsy</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seed.map((d) => {
          const p = published[d.id];
          return (
            <div key={d.id} className="rounded-xl subtle-card p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <div className="font-serif text-lg text-neutral-100">{d.title}</div>
                  <div className="text-[11px] tracking-[0.18em] text-neutral-500 mt-0.5">
                    {(p ? 'ON ETSY' : d.status.toUpperCase())} · {d.updated}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-[13px] text-neutral-400 leading-relaxed">
                Preview: A short, sensory description of the piece, followed by material, dimensions and care.
                The story is warm and craft-first — exactly how the brand voice memory instructs.
              </div>
              <div className="flex items-center gap-2 mt-5">
                {p ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full gap-2 bg-transparent border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                      <ExternalLink className="w-4 h-4" /> View on Etsy #{p.listing_id}
                    </Button>
                  </a>
                ) : (
                  <Button onClick={() => publish(d)} disabled={busy[d.id]} className="bg-orange-500 hover:bg-orange-600 gap-2">
                    {busy[d.id] ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</> : <><Send className="w-4 h-4" /> Publish to Etsy</>}
                  </Button>
                )}
                <Button variant="outline" className="bg-transparent border-white/10 text-neutral-200 hover:bg-white/5 gap-2"><Pencil className="w-4 h-4" />Edit</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

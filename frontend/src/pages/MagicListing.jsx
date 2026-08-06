import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Wand2, Upload, Image as ImageIcon, Loader2, Check, Send, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MagicListing() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [running, setRunning] = useState(false);
  const [publishing, setPublishing] = useState({});
  const [etsyConnected, setEtsyConnected] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let alive = true;
    axios.get(`${API}/etsy/status`)
      .then((r) => { if (alive) setEtsyConnected(!!r.data.connected); })
      .catch(() => { if (alive) setEtsyConnected(false); });
    return () => { alive = false; };
  }, []);

  const onFiles = (list) => {
    const arr = Array.from(list).slice(0, 20).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      file: f,
      url: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...arr].slice(0, 20));
  };

  const generate = async () => {
    if (!files.length) {
      toast({ title: 'Add photos first', description: 'Drop one or many product photos to begin.' });
      return;
    }
    setRunning(true);
    setDrafts([]);
    try {
      const results = [];
      for (const f of files) {
        const fd = new FormData();
        fd.append('image', f.file, f.name);
        try {
          const { data } = await axios.post(`${API}/magic/generate`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 120000,
          });
          results.push({ ...data, localId: f.id, previewUrl: f.url });
        } catch (e) {
          const msg = e?.response?.data?.detail || e.message;
          toast({ title: `Failed on ${f.name}`, description: String(msg).slice(0, 200) });
        }
      }
      setDrafts(results);
      if (results.length) {
        toast({ title: 'Listings ready', description: `${results.length} AI-written listing${results.length > 1 ? 's' : ''}.` });
      }
    } finally {
      setRunning(false);
    }
  };

  const publish = async (d) => {
    if (!etsyConnected) {
      toast({ title: 'Connect Etsy first', description: 'Head to Integrations and connect chhaape.' });
      return;
    }
    setPublishing((p) => ({ ...p, [d.localId]: true }));
    try {
      const { data } = await axios.post(`${API}/etsy/publish`, {
        title: d.title,
        description: d.description,
        tags: d.tags,
        price: d.price,
        quantity: 1,
        who_made: d.who_made,
        when_made: d.when_made,
        taxonomy_id: d.taxonomy_id,
        image_id: d.image_id,
      });
      setDrafts((prev) => prev.map((x) => x.localId === d.localId ? { ...x, etsy: data } : x));
      toast({ title: 'On Etsy as draft', description: `Listing #${data.listing_id}${data.image_uploaded ? ' · photo attached' : ''}` });
    } catch (e) {
      const msg = e?.response?.data?.detail || e.message;
      toast({ title: 'Etsy publish failed', description: String(msg).slice(0, 200) });
    } finally {
      setPublishing((p) => ({ ...p, [d.localId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Magic Listing</h1>
          <p className="text-neutral-500 mt-1">Upload one photo — or a whole batch. The AI reads each photo and writes a real Etsy listing.</p>
        </div>
      </div>

      {etsyConnected === false && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.05] p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-serif text-neutral-100">Etsy not connected yet</div>
            <div className="text-[13px] text-neutral-400 mt-0.5">You can still generate listings. Connect Etsy to push them to your shop with the photo.</div>
          </div>
          <Link to="/integrations"><Button className="bg-orange-500 hover:bg-orange-600">Connect Etsy</Button></Link>
        </div>
      )}

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
        <div className="text-neutral-500 text-[13px] mt-1">click to browse · JPEG, PNG, WEBP · up to 20 · 8MB each</div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div className="rounded-xl subtle-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-serif text-xl text-neutral-100">{files.length} photo{files.length > 1 ? 's' : ''} ready</div>
            <Button className="bg-orange-500 hover:bg-orange-600 gap-2" onClick={generate} disabled={running}>
              {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Reading photos…</> : <><Wand2 className="w-4 h-4" /> Generate listings</>}
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
            <div key={d.localId} className="rounded-xl subtle-card p-5 flex gap-4">
              <img src={d.previewUrl} alt="" className="w-32 h-32 object-cover rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg text-neutral-100 leading-tight">{d.title}</div>
                <div className="text-neutral-400 text-[12px] mt-2 line-clamp-4 leading-relaxed">{d.description}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {d.tags.slice(0, 6).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-neutral-400">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-orange-500 text-sm">${d.price}</div>
                  {d.etsy ? (
                    <a href={d.etsy.url} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="gap-1 bg-transparent border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                        <ExternalLink className="w-3.5 h-3.5" /> On Etsy #{d.etsy.listing_id}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white gap-1"
                      disabled={publishing[d.localId]}
                      onClick={() => publish(d)}
                    >
                      {publishing[d.localId] ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><Send className="w-3.5 h-3.5" /> Push to Etsy</>}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

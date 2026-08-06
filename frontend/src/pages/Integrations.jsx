import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plug, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { integrations as seed } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Integrations() {
  const [items, setItems] = useState(seed);
  const [etsy, setEtsy] = useState({ connected: false, shop_name: null, loading: true });
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const refreshEtsy = async () => {
    try {
      const { data } = await axios.get(`${API}/etsy/status`);
      setEtsy({ ...data, loading: false });
    } catch (e) {
      setEtsy({ connected: false, loading: false });
    }
  };

  useEffect(() => {
    refreshEtsy();
    const onMsg = (ev) => {
      if (ev?.data && ev.data.type === 'etsy-oauth') {
        if (ev.data.ok) {
          toast({ title: 'Etsy connected', description: ev.data.message });
          refreshEtsy();
        } else {
          toast({ title: 'Etsy connect failed', description: ev.data.message });
        }
        setBusy(false);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const connectEtsy = async () => {
    setBusy(true);
    try {
      const { data } = await axios.get(`${API}/etsy/connect`);
      const w = 600, h = 720;
      const left = window.screenX + (window.innerWidth - w) / 2;
      const top = window.screenY + (window.innerHeight - h) / 2;
      const popup = window.open(data.auth_url, 'etsy-oauth', `width=${w},height=${h},left=${left},top=${top}`);
      // Poll in case popup is blocked / user closes it
      const iv = setInterval(async () => {
        if (popup && popup.closed) {
          clearInterval(iv);
          setBusy(false);
          refreshEtsy();
        }
      }, 1000);
    } catch (e) {
      setBusy(false);
      toast({ title: 'Could not start Etsy connect', description: e?.response?.data?.detail || e.message });
    }
  };

  const disconnectEtsy = async () => {
    await axios.post(`${API}/etsy/disconnect`);
    toast({ title: 'Etsy disconnected' });
    refreshEtsy();
  };

  const toggleLocal = (name) => setItems((prev) => prev.map((i) => i.name === name ? { ...i, connected: !i.connected } : i));

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
        {/* Etsy card - REAL integration */}
        <div className="rounded-xl subtle-card p-5 ring-1 ring-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-orange-500 flex items-center justify-center font-serif text-white">E</div>
            <div>
              <div className="font-serif text-lg text-neutral-100">Etsy</div>
              <div className="text-[11px] tracking-[0.18em] text-neutral-500 mt-0.5">
                {etsy.loading ? 'CHECKING…' : etsy.connected ? `CONNECTED${etsy.shop_name ? ' · ' + etsy.shop_name : ''}` : 'NOT CONNECTED'}
              </div>
            </div>
          </div>
          <div className="text-[13px] text-neutral-400 mt-3 min-h-[42px]">Publish listings, sync orders & inventory. Real OAuth to your shop.</div>
          {etsy.connected ? (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 gap-2 bg-transparent border-white/10 text-neutral-200 hover:bg-white/5">
                <Check className="w-4 h-4" /> Connected
              </Button>
              <Button variant="ghost" className="text-neutral-400 hover:text-red-400" onClick={disconnectEtsy}>Disconnect</Button>
            </div>
          ) : (
            <Button onClick={connectEtsy} disabled={busy} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white gap-2">
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Waiting for Etsy…</> : 'Connect'}
            </Button>
          )}
        </div>

        {/* Other integrations (mock UI) */}
        {items.filter((i) => i.name !== 'Etsy').map((i) => (
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
              onClick={() => toggleLocal(i.name)}
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

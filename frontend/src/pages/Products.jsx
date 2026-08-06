import React, { useState } from 'react';
import { Plus, Sparkles, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { products as seed } from '../mock/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';

export default function Products() {
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'FABRIC', price: '', stock: '', desc: '' });
  const { toast } = useToast();

  const filtered = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()));

  const add = () => {
    if (!form.name) return;
    setItems((prev) => [{ id: `p${Date.now()}`, ...form, price: Number(form.price) || 0, stock: Number(form.stock) || 0, low: Number(form.stock) < 5 }, ...prev]);
    setOpen(false);
    setForm({ name: '', category: 'FABRIC', price: '', stock: '', desc: '' });
    toast({ title: 'Product added', description: form.name });
  };

  const del = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[34px] leading-tight text-neutral-100">Product Catalog</h1>
          <p className="text-neutral-500 mt-1">Your AI uses this to write listings, plan stock and grow sales.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="pl-9 bg-white/[0.03] border-white/10 text-neutral-200 placeholder:text-neutral-500 w-64" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#141110] border-white/10 text-neutral-200">
              <DialogHeader><DialogTitle className="font-serif text-xl">Add product</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/[0.03] border-white/10" />
                <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value.toUpperCase() })} className="bg-white/[0.03] border-white/10" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-white/[0.03] border-white/10" />
                  <Input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="bg-white/[0.03] border-white/10" />
                </div>
                <Input placeholder="Short description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="bg-white/[0.03] border-white/10" />
              </div>
              <DialogFooter>
                <Button onClick={add} className="bg-orange-500 hover:bg-orange-600">Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const low = p.stock < 5;
          return (
            <div key={p.id} className="rounded-xl subtle-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] tracking-[0.22em] text-orange-500">{p.category}</div>
                {low && <div className="text-[10px] tracking-[0.22em] text-red-400">LOW STOCK</div>}
              </div>
              <div className="font-serif text-[18px] mt-2 text-neutral-100 leading-snug">{p.name}</div>
              <div className="text-neutral-500 text-[12px] mt-1 line-clamp-2">{p.desc}</div>
              <div className="flex items-baseline gap-3 mt-4">
                <div className="text-neutral-100">${p.price}</div>
                <div className={`text-[12px] ${p.stock === 0 ? 'text-red-400' : low ? 'text-orange-500' : 'text-neutral-400'}`}>{p.stock} in stock</div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" className="flex-1 gap-2 bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30"><Sparkles className="w-3.5 h-3.5" />AI Listing</Button>
                <Button size="icon" variant="ghost" className="text-neutral-400 hover:text-neutral-100"><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => del(p.id)} className="text-neutral-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

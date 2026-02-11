
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi } from '../../data/catalogApi';
import { DbProduct, DbCollection } from '../adminTypes';
import { Button, Input, Select, StatusBadge } from '../ui/AdminComponents';
import { useToast } from '../ui/Toast';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<DbCollection[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCollection, setFilterCollection] = useState('');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    catalogApi.listCollections().then(res => res.data && setCollections(res.data));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filterStatus, filterCollection]); // Debounce search in real app

  const loadProducts = async () => {
    const { data } = await catalogApi.listProducts({ 
      status: filterStatus || undefined, 
      collectionId: filterCollection || undefined,
      search: search || undefined
    });
    if (data) setProducts(data);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl text-white font-light">Inventory</h1>
        <Link to="/admin/products/new">
          <Button>+ New Product</Button>
        </Link>
      </div>

      <div className="bg-[#141821] p-4 border border-white/5 flex flex-wrap gap-4 items-end">
        <form onSubmit={handleSearch} className="flex gap-4 flex-1">
          <Input 
            placeholder="Search by title..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="min-w-[200px]"
          />
          <Button type="submit" variant="ghost">Filter</Button>
        </form>
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-40">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>
        <Select value={filterCollection} onChange={e => setFilterCollection(e.target.value)} className="w-40">
          <option value="">All Collections</option>
          {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </Select>
      </div>

      <div className="overflow-x-auto border border-white/5">
        <table className="w-full text-left text-sm text-[#9FA3B0]">
          <thead className="bg-[#141821] text-xs uppercase tracking-wider font-medium text-white border-b border-white/5">
            <tr>
              <th className="p-4 w-16">Img</th>
              <th className="p-4">Title / Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4">Price</th>
              <th className="p-4">Collection</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#0B0D10]">
            {products.map(p => {
              const cover = p.images?.find((i: any) => i.is_cover)?.path || p.images?.[0]?.path;
              const imgUrl = catalogApi.getPublicImageUrl(cover);
              return (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="w-10 h-10 bg-[#141821] border border-white/10 flex items-center justify-center overflow-hidden">
                      {imgUrl ? <img src={imgUrl} className="w-full h-full object-cover" /> : <span className="text-[9px]">NO IMG</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{p.title}</div>
                    <div className="text-xs opacity-50 font-mono">{p.slug}</div>
                  </td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4 font-mono">{(p.price_cents / 100).toFixed(2)} {p.currency}</td>
                  <td className="p-4">{p.collection?.title || '-'}</td>
                  <td className="p-4 text-right">
                    <Link to={`/admin/products/${p.id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && <div className="p-8 text-center opacity-50">No products found.</div>}
      </div>
    </div>
  );
};

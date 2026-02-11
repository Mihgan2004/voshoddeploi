
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { catalogApi } from '../../data/catalogApi';
import { DbProduct, DbProductImage, DbCollection } from '../adminTypes';
import { Button, Input, Select, StatusBadge, Modal } from '../ui/AdminComponents';
import { useToast } from '../ui/Toast';

export const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isNew = id === 'new';

  const [product, setProduct] = useState<Partial<DbProduct>>({
    title: '', slug: '', price_cents: 0, currency: 'USD', status: 'draft', collection_id: ''
  });
  const [images, setImages] = useState<DbProductImage[]>([]);
  const [collections, setCollections] = useState<DbCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    catalogApi.listCollections().then(res => res.data && setCollections(res.data));
    if (!isNew && id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    const { data, error } = await catalogApi.getProduct(productId);
    if (error) {
      addToast('Error loading product', 'error');
      navigate('/admin/products');
      return;
    }
    setProduct(data);
    loadImages(productId);
  };

  const loadImages = async (productId: string) => {
    const { data } = await catalogApi.listProductImages(productId);
    if (data) setImages(data);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isNew) {
        // Create new
        const payload: any = { ...product };
        if (!payload.slug) payload.slug = payload.title?.toLowerCase().replace(/\s+/g, '-');
        
        const { data, error } = await catalogApi.createProduct(payload);
        if (error) throw error;
        addToast('Product created', 'success');
        navigate(`/admin/products/${data.id}`, { replace: true });
      } else {
        // Update existing
        const { error } = await catalogApi.updateProduct(id!, product);
        if (error) throw error;
        addToast('Product updated', 'success');
      }
    } catch (e: any) {
      addToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      // Delete all images first
      for (const img of images) await catalogApi.deleteImage(img);
      await catalogApi.deleteProduct(id);
      addToast('Product deleted', 'success');
      navigate('/admin/products');
    } catch (e: any) {
      addToast(e.message, 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !id) return;
    setLoading(true);
    try {
      for (const file of e.target.files) {
        await catalogApi.uploadProductImage(id, file);
      }
      loadImages(id);
      addToast('Images uploaded', 'success');
    } catch (e: any) {
      addToast(e.message, 'error');
    } finally {
      setLoading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSetCover = async (img: DbProductImage) => {
    // Optimistic UI could be implemented here, but simple sequential update is safer
    const oldCover = images.find(i => i.is_cover);
    if (oldCover) await catalogApi.updateImageMeta(oldCover.id, { is_cover: false });
    await catalogApi.updateImageMeta(img.id, { is_cover: true });
    loadImages(id!);
  };

  const handleDeleteImage = async (img: DbProductImage) => {
    if (confirm('Delete this image?')) {
      await catalogApi.deleteImage(img);
      loadImages(id!);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start sticky top-0 bg-[#0B0D10]/95 backdrop-blur z-10 py-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl text-white font-light">{isNew ? 'New Product' : 'Edit Product'}</h1>
          <div className="text-xs text-[#9FA3B0] mt-1 font-mono">{id}</div>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete</Button>
          )}
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#141821] p-6 border border-white/5 space-y-4">
            <h2 className="text-lg text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Title" 
                value={product.title} 
                onChange={e => setProduct({...product, title: e.target.value})} 
              />
              <Input 
                label="Slug" 
                value={product.slug} 
                onChange={e => setProduct({...product, slug: e.target.value})} 
                placeholder="auto-generated"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Status" 
                value={product.status} 
                onChange={e => setProduct({...product, status: e.target.value as any})}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
              <Select 
                label="Collection" 
                value={product.collection_id || ''} 
                onChange={e => setProduct({...product, collection_id: e.target.value})}
              >
                <option value="">Select Collection</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <Input 
                label="Price (Cents)" 
                type="number" 
                value={product.price_cents} 
                onChange={e => setProduct({...product, price_cents: parseInt(e.target.value)})} 
              />
               <Input 
                label="Currency" 
                value={product.currency} 
                onChange={e => setProduct({...product, currency: e.target.value})} 
              />
               <Input 
                label="Limited Count" 
                type="number"
                placeholder="Optional"
                value={product.limited_count || ''} 
                onChange={e => setProduct({...product, limited_count: e.target.value ? parseInt(e.target.value) : undefined})} 
              />
            </div>
          </div>

          <div className="bg-[#141821] p-6 border border-white/5 space-y-4">
            <h2 className="text-lg text-white mb-4">Content</h2>
            <div className="flex flex-col gap-1.5">
               <label className="text-xs text-[#9FA3B0] uppercase tracking-wider font-semibold">Short Description</label>
               <textarea 
                  className="h-24 px-3 py-2 bg-[#0B0D10] border border-white/10 text-[#F5F5F5] focus:border-[#C6902E] focus:outline-none"
                  value={product.short_description || ''}
                  onChange={e => setProduct({...product, short_description: e.target.value})}
               />
            </div>
             <div className="flex flex-col gap-1.5">
               <label className="text-xs text-[#9FA3B0] uppercase tracking-wider font-semibold">Full Description (HTML/MD)</label>
               <textarea 
                  className="h-48 px-3 py-2 bg-[#0B0D10] border border-white/10 text-[#F5F5F5] focus:border-[#C6902E] focus:outline-none font-mono text-sm"
                  value={product.description || ''}
                  onChange={e => setProduct({...product, description: e.target.value})}
               />
            </div>
          </div>
        </div>

        {/* Images Side Panel */}
        <div className="space-y-6">
          <div className="bg-[#141821] p-6 border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-white">Images</h2>
              <label className="cursor-pointer px-3 py-1 bg-white/10 hover:bg-white/20 text-xs uppercase tracking-wider font-medium text-white transition-colors">
                + Add
                <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={isNew} />
              </label>
            </div>
            
            {isNew && <p className="text-sm text-yellow-500/80">Save product first to upload images.</p>}

            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={img.id} className="flex gap-3 items-center bg-[#0B0D10] p-2 border border-white/10 group">
                  <div className="w-16 h-16 bg-black relative">
                    <img src={catalogApi.getPublicImageUrl(img.path)!} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    {img.is_cover && <div className="absolute top-0 left-0 bg-[#C6902E] text-black text-[9px] font-bold px-1">COVER</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#9FA3B0] truncate mb-1">{img.path.split('/').pop()}</div>
                    <div className="flex gap-2">
                       <button onClick={() => handleSetCover(img)} className={`text-[10px] uppercase ${img.is_cover ? 'text-[#C6902E]' : 'text-gray-500 hover:text-white'}`}>
                          {img.is_cover ? 'Cover' : 'Set Cover'}
                       </button>
                       <button onClick={() => handleDeleteImage(img)} className="text-[10px] uppercase text-red-500/50 hover:text-red-400">
                          Delete
                       </button>
                    </div>
                  </div>
                </div>
              ))}
              {images.length === 0 && !isNew && <div className="text-sm text-[#9FA3B0] text-center py-4">No images yet.</div>}
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        title="Confirm Deletion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Permanently</Button>
          </>
        }
      >
        <p className="text-sm text-[#9FA3B0]">Are you sure you want to delete <span className="text-white font-medium">{product.title}</span>? This cannot be undone.</p>
      </Modal>
    </div>
  );
};

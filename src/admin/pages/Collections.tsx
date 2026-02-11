
import React, { useEffect, useState } from 'react';
import { catalogApi } from '../../data/catalogApi';
import { DbCollection } from '../adminTypes';
import { Button, Input, Select, Modal } from '../ui/AdminComponents';
import { useToast } from '../ui/Toast';

export const Collections: React.FC = () => {
  const [collections, setCollections] = useState<DbCollection[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<DbCollection> | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const { data } = await catalogApi.listCollections();
    if (data) setCollections(data);
  };

  const handleEdit = (col: DbCollection) => {
    setEditing({ ...col });
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditing({ type: 'core', sort_index: 0, is_published: true, title: '', slug: '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      if ('id' in editing) {
        await catalogApi.updateCollection(editing.id!, editing);
      } else {
        await catalogApi.createCollection(editing);
      }
      setModalOpen(false);
      loadCollections();
      addToast('Collection saved', 'success');
    } catch (e: any) {
      addToast(e.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete collection?')) return;
    await catalogApi.deleteCollection(id);
    loadCollections();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl text-white font-light">Collections</h1>
        <Button onClick={handleNew}>+ New Collection</Button>
      </div>

      <div className="bg-[#141821] border border-white/5">
        <table className="w-full text-left text-sm text-[#9FA3B0]">
          <thead className="bg-white/5 text-xs uppercase text-white border-b border-white/5">
             <tr>
               <th className="p-4">Sort</th>
               <th className="p-4">Title</th>
               <th className="p-4">Type</th>
               <th className="p-4">Status</th>
               <th className="p-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {collections.map(c => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-mono text-xs">{c.sort_index}</td>
                <td className="p-4"><span className="text-white font-medium">{c.title}</span> <span className="opacity-50 ml-2 text-xs">/{c.slug}</span></td>
                <td className="p-4 uppercase text-xs tracking-wider">{c.type}</td>
                <td className="p-4">{c.is_published ? <span className="text-green-400">Live</span> : <span className="text-yellow-400">Hidden</span>}</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(c)} className="mr-2">Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300 border-red-900/30">Del</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editing && 'id' in editing ? 'Edit Collection' : 'New Collection'}
        footer={<Button onClick={handleSave}>Save Collection</Button>}
      >
        <div className="flex flex-col gap-4">
          <Input 
            label="Title" 
            value={editing?.title || ''} 
            onChange={e => setEditing(prev => ({ ...prev!, title: e.target.value }))} 
          />
          <Input 
            label="Slug" 
            value={editing?.slug || ''} 
            onChange={e => setEditing(prev => ({ ...prev!, slug: e.target.value }))} 
          />
          <div className="grid grid-cols-2 gap-4">
             <Select 
                label="Type" 
                value={editing?.type || 'core'}
                onChange={e => setEditing(prev => ({ ...prev!, type: e.target.value as any }))}
             >
                <option value="core">Core</option>
                <option value="limited">Limited</option>
                <option value="archive">Archive</option>
             </Select>
             <Input 
                label="Sort Index" 
                type="number"
                value={editing?.sort_index ?? 0}
                onChange={e => setEditing(prev => ({ ...prev!, sort_index: parseInt(e.target.value) }))}
             />
          </div>
          <div className="flex items-center gap-2 mt-2">
             <input 
                type="checkbox" 
                checked={editing?.is_published ?? true}
                onChange={e => setEditing(prev => ({ ...prev!, is_published: e.target.checked }))}
                className="w-4 h-4 bg-transparent border border-white/20 accent-[#C6902E]"
             />
             <span className="text-sm text-white">Published</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

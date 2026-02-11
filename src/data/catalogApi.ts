
import { supabase } from '../lib/supabaseClient';
import { DbProduct, DbCollection, DbProductImage, CreateProductPayload, ProductStatus } from '../admin/adminTypes';

export const catalogApi = {
  // --- Auth ---
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signOut() {
    return supabase.auth.signOut();
  },
  async getSession() {
    return supabase.auth.getSession();
  },
  async isAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single();
    return !!data;
  },

  // --- Collections ---
  async listCollections() {
    return supabase.from('collections').select('*').order('sort_index', { ascending: true });
  },
  async createCollection(payload: Partial<DbCollection>) {
    return supabase.from('collections').insert(payload).select().single();
  },
  async updateCollection(id: string, payload: Partial<DbCollection>) {
    return supabase.from('collections').update(payload).eq('id', id).select().single();
  },
  async deleteCollection(id: string) {
    return supabase.from('collections').delete().eq('id', id);
  },

  // --- Products ---
  async listProducts({ search, status, collectionId }: { search?: string; status?: string; collectionId?: string }) {
    let query = supabase.from('products').select(`
      *,
      collection:collections(title),
      images:product_images(path)
    `).order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (collectionId) query = query.eq('collection_id', collectionId);
    if (search) query = query.ilike('title', `%${search}%`);

    return query;
  },
  async getProduct(id: string) {
    return supabase.from('products').select('*').eq('id', id).single();
  },
  async createProduct(payload: CreateProductPayload) {
    return supabase.from('products').insert(payload).select().single();
  },
  async updateProduct(id: string, payload: Partial<DbProduct>) {
    return supabase.from('products').update(payload).eq('id', id).select().single();
  },
  async deleteProduct(id: string) {
    return supabase.from('products').delete().eq('id', id);
  },
  async getProductCounts() {
    // Quick approximation
    const { count: draft } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'draft');
    const { count: published } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published');
    const { count: archived } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'archived');
    return { draft, published, archived };
  },

  // --- Images ---
  async listProductImages(productId: string) {
    return supabase.from('product_images').select('*').eq('product_id', productId).order('sort_index');
  },
  async uploadProductImage(productId: string, file: File) {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const path = `products/${productId}/${filename}`;
    
    const { error: uploadError } = await supabase.storage.from('products').upload(path, file);
    if (uploadError) throw uploadError;

    return supabase.from('product_images').insert({
      product_id: productId,
      path,
      sort_index: 999, // append to end
      is_cover: false
    }).select().single();
  },
  async updateImageMeta(id: string, payload: Partial<DbProductImage>) {
    return supabase.from('product_images').update(payload).eq('id', id);
  },
  async deleteImage(image: DbProductImage) {
    // Delete from storage
    await supabase.storage.from('products').remove([image.path]);
    // Delete from db
    return supabase.from('product_images').delete().eq('id', image.id);
  },
  getPublicImageUrl(path: string | undefined) {
    if (!path) return null;
    return supabase.storage.from('products').getPublicUrl(path).data.publicUrl;
  }
};

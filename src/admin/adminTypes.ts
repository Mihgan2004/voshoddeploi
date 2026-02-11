
export type ProductStatus = 'draft' | 'published' | 'archived';
export type CollectionType = 'core' | 'limited' | 'archive';

export interface DbCollection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: CollectionType;
  sort_index: number;
  is_published: boolean;
}

export interface DbProduct {
  id: string;
  slug: string;
  title: string;
  price_cents: number;
  currency: string;
  status: ProductStatus;
  collection_id: string;
  short_description?: string;
  description?: string;
  specs?: Record<string, any>;
  limited_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DbProductImage {
  id: string;
  product_id: string;
  path: string;
  alt?: string;
  sort_index: number;
  is_cover: boolean;
}

export interface AdminUser {
  user_id: string;
}

export interface CreateProductPayload {
  title: string;
  slug: string;
  status: ProductStatus;
  collection_id?: string;
  price_cents: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  collectionId: string;
  category: 'tee' | 'hoodie' | 'patch' | 'accessory';
  status: 'available' | 'preorder' | 'archive' | 'limited';
  limitedCount?: number;
  description: string;
  specs: {
    code: string;
    batch: string;
    material: string;
    gsm: string;
  };
  imagePlaceholder: string; // Using picsum for demo
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tag: 'LIMITED' | 'ARCHIVE' | 'CORE';
  description: string;
}

export interface CartItem extends Product {
  cartId: string;
  size: string;
}
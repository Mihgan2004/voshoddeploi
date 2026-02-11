import { Collection, Product } from './types';

export const COLLECTIONS: Collection[] = [
  { id: 'c1', slug: 'orbit', name: 'ОРБИТА', tag: 'LIMITED', description: 'Equipment for extra-atmospheric operations.' },
  { id: 'c2', slug: 'signal', name: 'СИГНАЛ', tag: 'CORE', description: 'Communication protocols and hardware links.' },
  { id: 'c3', slug: 'horizon', name: 'ГОРИЗОНТ', tag: 'LIMITED', description: 'Visual range extension gear.' },
  { id: 'c4', slug: 'archive', name: 'АРХИВ', tag: 'ARCHIVE', description: 'Decommissioned experimental units.' },
  { id: 'c5', slug: 'route', name: 'ТРАССА', tag: 'CORE', description: 'High-speed transit essentials.' },
  { id: 'c6', slug: 'nightpost', name: 'НОЧНОЙ ПОСТ', tag: 'LIMITED', description: 'Low-light visibility and stealth.' },
  { id: 'c7', slug: 'batch-zero', name: 'ПАРТИЯ НОЛЬ', tag: 'ARCHIVE', description: 'Prototype run. Do not distribute.' },
  { id: 'c8', slug: 'contour', name: 'КОНТУР', tag: 'CORE', description: 'Structural reinforcement layers.' },
];

export const PRODUCTS: Product[] = [
  // Orbit Collection
  {
    id: 'p1', slug: 'orbit-tee-v1', name: 'Orbital Tee V1', price: 4500, collectionId: 'c1', category: 'tee', status: 'available', limitedCount: 120,
    description: 'Standard issue EVA base layer. Breathable synthetic blend.',
    specs: { code: 'ORB-01', batch: '02', material: 'Cotton/Poly', gsm: '240' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=1'
  },
  {
    id: 'p2', slug: 'orbit-hoodie', name: 'Zero-G Hoodie', price: 12000, collectionId: 'c1', category: 'hoodie', status: 'preorder', limitedCount: 50,
    description: 'Thermal regulation for vacuum exposure simulation.',
    specs: { code: 'ORB-02', batch: '01', material: 'Heavy French Terry', gsm: '480' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=2'
  },
  // Signal Collection
  {
    id: 'p3', slug: 'signal-patch-set', name: 'Freq Patch Set', price: 1500, collectionId: 'c2', category: 'patch', status: 'available',
    description: 'Identification markers for radio silence zones.',
    specs: { code: 'SIG-09', batch: '05', material: 'Rubber/Velcro', gsm: 'N/A' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=3'
  },
  {
    id: 'p4', slug: 'signal-tee', name: 'Carrier Wave Tee', price: 4200, collectionId: 'c2', category: 'tee', status: 'available',
    description: 'Graphic print displaying encrypted waveform data.',
    specs: { code: 'SIG-01', batch: '03', material: '100% Cotton', gsm: '220' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=4'
  },
  // Horizon
  {
    id: 'p5', slug: 'horizon-cap', name: 'Visor Cap', price: 3800, collectionId: 'c3', category: 'accessory', status: 'available',
    description: 'Glare reduction headwear for solar maximum.',
    specs: { code: 'HRZ-04', batch: '02', material: 'Nylon', gsm: '120' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=5'
  },
  // Night Post
  {
    id: 'p6', slug: 'night-parka', name: 'Sentry Parka', price: 24000, collectionId: 'c6', category: 'hoodie', status: 'limited', limitedCount: 20,
    description: 'Insulated outer shell for graveyard shifts.',
    specs: { code: 'NPT-01', batch: '01', material: 'Tech Membrane', gsm: '300' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=6'
  },
  // Route
  {
    id: 'p7', slug: 'route-bag', name: 'Transit Pack', price: 8500, collectionId: 'c5', category: 'accessory', status: 'available',
    description: 'Minimalist storage for rapid transit protocols.',
    specs: { code: 'RTE-03', batch: '04', material: 'Cordura', gsm: '500D' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=7'
  },
  {
    id: 'p8', slug: 'contour-belt', name: 'Rig Belt', price: 3000, collectionId: 'c8', category: 'accessory', status: 'available',
    description: 'Load bearing utility belt with magnetic buckle.',
    specs: { code: 'CTR-02', batch: '08', material: 'Webbing', gsm: 'N/A' },
    imagePlaceholder: 'https://picsum.photos/800/1000?random=8'
  }
];

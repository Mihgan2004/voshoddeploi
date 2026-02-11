import React, { useEffect, useState } from 'react';
import {HashRouter as Router, Routes, Route, Link, useParams, useLocation, Navigate} from 'react-router-dom';

import { ToastProvider } from './admin/ui/Toast';
import { AdminLayout } from './admin/AdminLayout';
import { RequireAdmin } from './admin/RequireAdmin';
import { Login as AdminLogin } from './admin/pages/Login';
import { Dashboard as AdminDashboard } from './admin/pages/Dashboard';
import { Products as AdminProducts } from './admin/pages/Products';
import { ProductEdit as AdminProductEdit } from './admin/pages/ProductEdit';
import { Collections as AdminCollections } from './admin/pages/Collections';
import { OrbitalDock } from './components/OrbitalDock';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Stamp } from './components/Stamp';
import { useCart } from './store';
import { COLLECTIONS, PRODUCTS } from './data';
import { Collection, Product } from './types';
import { WelcomeBlock } from './components/WelcomeBlock';
import { TeeIntroBlock } from './components/TeeIntroBlock';

// --- Page Components (Inline for single-file structure requirement, conceptually separate) ---

const Footer = () => (
  <footer className="mt-32 border-t border-white/5 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
      <div className="text-xs text-gray-600 font-mono">
        <p>© 2024 VOSKHOD. MOSCOW.</p>
        <p className="mt-1">ALL SYSTEMS NOMINAL.</p>
      </div>
      <div className="flex gap-6 text-xs text-gray-400 uppercase tracking-widest">
        <Link to="/legal/offer" className="hover:text-gold">Offer</Link>
        <Link to="/legal/shipping" className="hover:text-gold">Shipping</Link>
        <Link to="/legal/policy" className="hover:text-gold">Privacy</Link>
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="animate-fade-in">
      <Hero />
      <WelcomeBlock />
      <TeeIntroBlock />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <span className="text-[18px] font-mono tracking-widest text-[#9FA3B0]">В НАЛИЧИИ</span>
            <span className="h-px w-24 bg-white/10" />
            <span className="text-[16px] font-mono tracking-widest text-white/30">СМОТРЕТЬ</span>
          </div>

          <Link
            to="/catalog"
            className="text-[18px] font-mono tracking-widest text-[#C6902E] hover:text-[#C6902E] uppercase"
          >
            В КАТАЛОГ →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14 md:gap-y-16">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
};


const CollectionsPage = () => (
  <div className="pt-32 max-w-7xl mx-auto px-6 animate-fade-in min-h-screen">
    <h1 className="text-4xl font-light mb-16">COLLECTIONS</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {COLLECTIONS.map(col => (
        <Link key={col.id} to={`/collections/${col.slug}`} className="group relative h-64 bg-graphite-light rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center hover:border-gold/20 transition-all duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-widest text-gray-400 group-hover:text-white transition-colors uppercase">
              {col.name}
            </h2>
            <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-4 transition-all duration-300">
              <span className="inline-block px-3 py-1 border border-gold/50 text-gold text-[10px] font-mono rounded-full">
                {col.tag} / {col.id.toUpperCase()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const CatalogPage = () => {
  // Simple category filter logic
  const [filter, setFilter] = useState<'all' | 'tee' | 'hoodie' | 'accessory'>('all');
  
  const filteredProducts = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="pt-32 max-w-7xl mx-auto px-6 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <h1 className="text-4xl font-light">CATALOG</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest">
          {['all', 'tee', 'hoodie', 'accessory'].map((cat) => (
             <button 
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-4 py-2 border rounded-full transition-all ${
                filter === cat 
                  ? 'border-gold text-gold bg-gold/10' 
                  : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'
              }`}
             >
               {cat}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

const CollectionDetail = () => {
  const { slug } = useParams();
  const collection = COLLECTIONS.find(c => c.slug === slug);
  const products = PRODUCTS.filter(p => p.collectionId === collection?.id);

  if (!collection) return <div className="pt-40 text-center">NOT FOUND</div>;

  return (
    <div className="pt-32 max-w-7xl mx-auto px-6 animate-fade-in min-h-screen">
      <div className="mb-16 border-l-2 border-gold pl-6 py-2">
        <h1 className="text-5xl font-light uppercase mb-4">{collection.name}</h1>
        <p className="text-gray-400 max-w-lg font-mono text-sm leading-relaxed">
          // FILE: {collection.id.toUpperCase()}<br/>
          // STATUS: {collection.tag}<br/>
          {collection.description}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

const ProductPage = ({ addToCart }: { addToCart: (p: Product, s: string) => void }) => {
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');

  if (!product) return <div className="pt-40 text-center">PRODUCT NOT FOUND</div>;

  return (
    <div className="pt-32 max-w-7xl mx-auto px-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Gallery */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-2">
          <div className="col-span-2 aspect-[4/3] bg-graphite-light rounded-lg border border-white/5 relative overflow-hidden">
             <span className="absolute top-4 left-4 text-[10px] font-mono text-gray-600">FRONT_VIEW_01</span>
             <img src={product.imagePlaceholder} className="w-full h-full object-cover opacity-90" alt="" />
          </div>
          <div className="aspect-square bg-graphite-light rounded-lg border border-white/5 relative overflow-hidden">
             <span className="absolute top-4 left-4 text-[10px] font-mono text-gray-600">DETAIL_MACRO</span>
             <img src={`https://picsum.photos/400/400?random=${product.id}`} className="w-full h-full object-cover opacity-80 grayscale" alt="" />
          </div>
          <div className="aspect-square bg-graphite-light rounded-lg border border-white/5 relative overflow-hidden">
             <span className="absolute top-4 left-4 text-[10px] font-mono text-gray-600">MATERIAL_TEX</span>
             <div className="w-full h-full bg-noise opacity-50"></div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-medium uppercase tracking-wide">{product.name}</h1>
              <div className="text-right">
                <span className="block text-xl font-mono text-gold">{product.price.toLocaleString('ru-RU')} ₽</span>
                <span className="text-[10px] text-gray-500 uppercase">{product.status}</span>
              </div>
            </div>

            {/* Passport Table */}
            <div className="mb-8 border border-white/10 rounded-lg overflow-hidden">
               <div className="bg-white/5 px-4 py-2 text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">Technical Passport</div>
               <div className="grid grid-cols-2 text-xs font-mono p-4 gap-y-2">
                  <span className="text-gray-500">CODE</span><span>{product.specs.code}</span>
                  <span className="text-gray-500">BATCH</span><span>{product.specs.batch}</span>
                  <span className="text-gray-500">MAT</span><span>{product.specs.material}</span>
                  <span className="text-gray-500">GSM</span><span>{product.specs.gsm}</span>
               </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <span className="text-xs text-gray-500 mb-2 block">SIZE UNIT</span>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border rounded transition-all ${
                      selectedSize === size 
                        ? 'border-gold text-gold bg-gold/5' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={() => addToCart(product, selectedSize)}
              className="w-full bg-white text-black h-14 font-bold tracking-widest uppercase hover:bg-gold hover:text-black transition-colors mb-8"
            >
              Initialize Order
            </button>

            {/* Accordion */}
            <div className="border-t border-white/10">
              <button 
                onClick={() => setActiveTab('details')}
                className="w-full text-left py-4 flex justify-between items-center text-xs uppercase tracking-widest hover:text-white text-gray-400"
              >
                <span>Description</span>
                <span>{activeTab === 'details' ? '-' : '+'}</span>
              </button>
              {activeTab === 'details' && (
                <div className="pb-4 text-sm text-gray-500 leading-relaxed animate-fade-in">
                  {product.description}
                  <br/><br/>
                  Designed in Moscow. Assembled under strict supervision.
                </div>
              )}
               <div className="border-t border-white/10"></div>
               <button 
                onClick={() => setActiveTab('shipping')}
                className="w-full text-left py-4 flex justify-between items-center text-xs uppercase tracking-widest hover:text-white text-gray-400"
              >
                <span>Logistics</span>
                <span>{activeTab === 'shipping' ? '-' : '+'}</span>
              </button>
              {activeTab === 'shipping' && (
                <div className="pb-4 text-sm text-gray-500 leading-relaxed animate-fade-in">
                  Orders dispatched within 48h. Global shipping available via secure courier channels.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, removeFromCart }: { cart: any[], removeFromCart: (id: string) => void }) => {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="pt-32 max-w-4xl mx-auto px-6 min-h-screen animate-fade-in">
      <h1 className="text-4xl font-light mb-12">REQUISITION LIST</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
          <p className="text-gray-500 font-mono mb-4">NO ITEMS DETECTED</p>
          <Link to="/catalog" className="text-gold hover:underline">ACCESS CATALOG</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.cartId} className="flex gap-6 items-center bg-white/5 p-4 rounded-lg border border-white/5">
              <div className="w-20 h-24 bg-graphite-light rounded overflow-hidden flex-shrink-0">
                <img src={item.imagePlaceholder} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-xs text-crimson-light hover:text-crimson">REMOVE</button>
                </div>
                <div className="flex gap-4 mt-2 text-xs font-mono text-gray-400">
                  <span>SIZE: {item.size}</span>
                  <span>{item.specs.code}</span>
                </div>
                <div className="mt-2 text-gold font-mono">{item.price.toLocaleString('ru-RU')} ₽</div>
              </div>
            </div>
          ))}
          
          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-end">
            <div className="text-xs text-gray-500 font-mono">
              TAX INCLUDED<br/>SHIPPING CALCULATED AT CHECKOUT
            </div>
            <div className="text-right">
              <div className="text-3xl font-light text-white mb-4">{total.toLocaleString('ru-RU')} ₽</div>
              <button className="bg-gold text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors">
                PROCEED
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Main Layout & App Wrapper ---

const AppContent = () => {
  const { cart, addToCart, removeFromCart, stampVisible } = useCart();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-graphite font-sans text-gray-200">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />

<Route
  path="/admin"
  element={
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  }
>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductEdit />} />
            <Route path="products/:id" element={<AdminProductEdit />} />
            <Route path="collections" element={<AdminCollections />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    );
  }

  // storefront
  return (
    <div className="min-h-screen bg-graphite font-sans text-gray-200 selection:bg-gold selection:text-black">
      <ScrollToTop />
      {stampVisible && <Stamp />}
      <OrbitalDock cartCount={cart.length} />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/product/:slug" element={<ProductPage addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="*" element={<div className="pt-40 text-center">404 - LOST SIGNAL</div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};


const App = () => {
  return (
    <ToastProvider>
      <Router>
      <AppContent />
    </Router>
    </ToastProvider>
  );
};

export default App;

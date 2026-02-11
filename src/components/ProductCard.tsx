import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`} className="group relative block">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-graphite-light rounded-xl border border-white/5 transition-all duration-500 group-hover:border-white/20">
        
        {/* Placeholder/Image */}
        <img 
          src={product.imagePlaceholder} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-100 grayscale group-hover:grayscale-0"
        />

        {/* Hover Scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[10%] w-full opacity-0 group-hover:opacity-100 animate-scanline pointer-events-none" />

        {/* Meta Overlay (Only on Hover) */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <div className="flex justify-between text-xs font-mono text-gold mb-1">
               <span>{product.specs.code}</span>
               <span>BATCH {product.specs.batch}</span>
             </div>
             <p className="text-xs text-gray-300 line-clamp-2">{product.description}</p>
          </div>
        </div>
        
        {/* Status Tag (Always Visible but subtle) */}
        {product.status !== 'available' && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider text-white">
            {product.status}
          </div>
        )}
      </div>

      {/* Info Below */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium tracking-wide text-gray-200 group-hover:text-white transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
        </div>
        <span className="text-sm font-mono text-gray-400">
          {product.price.toLocaleString('ru-RU')} ₽
        </span>
      </div>
    </Link>
  );
};

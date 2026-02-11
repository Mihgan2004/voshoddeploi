import { useState, useEffect } from 'react';
import { CartItem, Product } from './types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stampVisible, setStampVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('voskhod_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('voskhod_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, size: string) => {
    const newItem: CartItem = { ...product, cartId: Math.random().toString(36).substr(2, 9), size };
    setCart(prev => [...prev, newItem]);
    
    // Trigger Animation
    setStampVisible(true);
    setTimeout(() => setStampVisible(false), 900);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  return { cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, stampVisible };
};

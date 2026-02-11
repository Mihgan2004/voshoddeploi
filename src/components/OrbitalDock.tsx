import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface OrbitalDockProps {
  cartCount: number;
}

export const OrbitalDock: React.FC<OrbitalDockProps> = ({ cartCount }) => {
  const [time, setTime] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out
        ${scrolled ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}
      `}
    >
      <div className="relative group rounded-full">
        {/* Container */}
        <div className="
          relative overflow-hidden rounded-full 
          bg-graphite/60 backdrop-blur-md 
          border border-white/10 
          px-6 py-3
          flex items-center gap-8
          shadow-lg shadow-black/20
        ">
          
          {/* Glint Animation Layer */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-glint" />
          </div>

          {/* Left: Brand */}
          <Link to="/" className="font-bold tracking-widest text-sm text-gray-200 hover:text-gold transition-colors z-10">
            VOSKHOD
          </Link>

          {/* Center: Nav */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-400 z-10">
            <Link to="/catalog" className={`hover:text-white transition-colors ${location.pathname === '/catalog' ? 'text-white' : ''}`}>КАТАЛОГ</Link>
            <Link to="/collections" className={`hover:text-white transition-colors ${location.pathname === '/collections' ? 'text-white' : ''}`}>КОЛЛЕКЦИИ</Link>
            <Link to="/info" className="hover:text-white transition-colors">ИНФО</Link>
          </div>

          {/* Right: Meta */}
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400 z-10">
            <span className="hidden sm:inline-block border-r border-white/10 pr-4">
              MSC {time}
            </span>
            <Link to="/cart" className="hover:text-gold transition-colors flex items-center gap-1">
              CART <span className="text-white">[{cartCount}]</span>
            </Link>
          </div>
        </div>
        
        {/* Iridescent Sheen on Border (Pseudo) */}
        <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none mix-blend-overlay"></div>
      </div>
    </nav>
  );
};

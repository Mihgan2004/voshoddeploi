import React from 'react';

export const Stamp: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-stamp border-4 border-gold text-gold px-8 py-2 text-4xl font-black uppercase tracking-widest opacity-0 transform -rotate-12 mix-blend-screen bg-black/20 backdrop-blur-sm rounded-lg shadow-[0_0_30px_rgba(212,175,55,0.4)]">
        ПРИНЯТО
      </div>
    </div>
  );
};

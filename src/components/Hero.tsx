import React, { useState } from "react";

export const Hero: React.FC = () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden mb-0 bg-[#0B0D10]">
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={() => setVideoError(true)}
          style={{ filter: "contrast(1.05) saturate(0.85) brightness(0.65)" }}
        >
          <source src="/video/ФИНАЛ.mp4" type="video/mp4" />
        </video>
      )}

      {videoError && (
        <div className="absolute inset-0 z-0 bg-[#0B0D10]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#141821] via-[#0B0D10] to-[#0B0D10] opacity-90" />
        </div>
      )}

      <div className="absolute inset-0 z-[1] bg-black/55" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.75)_85%)]" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-transparent via-transparent to-black/50" />
    </section>
  );
};

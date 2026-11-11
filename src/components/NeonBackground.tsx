import React from 'react';

interface NeonBackgroundProps {
  variant?: 'login' | 'app';
}

export const NeonBackground: React.FC<NeonBackgroundProps> = ({ variant = 'app' }) => {
  const isLogin = variant === 'login';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Luminous Ambient Glowing Blobs with Slow Floating Movement */}
      <div className="absolute inset-0">
        {/* Luminous Glow 1: Soft Sky Cyan */}
        <div
          className={`absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full bg-cyan-200/60 blur-[120px] animate-neon-orb-a ${
            isLogin ? 'opacity-80' : 'opacity-60'
          }`}
        />

        {/* Luminous Glow 2: Warm Sunny Gold */}
        <div
          className={`absolute -bottom-28 -right-28 w-[650px] h-[650px] rounded-full bg-amber-200/50 blur-[130px] animate-neon-orb-b ${
            isLogin ? 'opacity-70' : 'opacity-50'
          }`}
        />

        {/* Luminous Glow 3: Refreshing Royal Blue / Azure */}
        <div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-200/50 blur-[110px] animate-neon-orb-c opacity-50"
        />

        {/* Luminous Glow 4: Soft Lilac / Violet Whisper */}
        <div
          className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-indigo-200/40 blur-[100px] animate-neon-orb-a opacity-40"
        />

        {/* Slow Moving Pristine Blue Wave Ribbon Layer 1 */}
        <div
          className={`absolute -inset-16 bg-cover bg-center bg-no-repeat animate-neon-drift-1 filter saturate-125 contrast-105 ${
            isLogin ? 'opacity-85' : 'opacity-45'
          }`}
          style={{
            backgroundImage: "url('/bg_wave.png')",
          }}
        />

        {/* Slow Moving Pristine Wave Layer 2 (Cross-Drift for ethereal slow depth) */}
        <div
          className={`absolute -inset-20 bg-cover bg-center bg-no-repeat animate-neon-drift-2 filter saturate-110 opacity-30 mix-blend-multiply`}
          style={{
            backgroundImage: "url('/bg_wave.png')",
          }}
        />
      </div>

      {/* Soft Radial Vignette for Balanced Center Brightness */}
      <div className="absolute inset-0 bg-radial from-transparent via-white/20 to-sky-100/40" />

      {/* Main app screen overlay: maintains pristine clarity and readability for all text & cards */}
      {!isLogin && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      )}
    </div>
  );
};

import React from 'react';

interface NeonBackgroundProps {
  variant?: 'login' | 'app';
}

export const NeonBackground: React.FC<NeonBackgroundProps> = ({ variant = 'app' }) => {
  const isLogin = variant === 'login';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#030712]">
      {/* Dynamic Neon Color-Cycling Container */}
      <div className="absolute inset-0 animate-neon-cycle">
        {/* Neon Orb 1: Glowing Electric Cyan (#00f0ff) */}
        <div
          className={`absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-cyan-400 blur-[130px] mix-blend-screen animate-neon-orb-a ${
            isLogin ? 'opacity-65' : 'opacity-45'
          }`}
        />

        {/* Neon Orb 2: Glowing Electric Violet / Magenta (#c026d3 / #a855f7) */}
        <div
          className={`absolute -bottom-36 -right-36 w-[700px] h-[700px] rounded-full bg-fuchsia-500 blur-[140px] mix-blend-screen animate-neon-orb-b ${
            isLogin ? 'opacity-60' : 'opacity-40'
          }`}
        />

        {/* Neon Orb 3: Glowing Electric Royal Blue (#2563eb / #0066ff) */}
        <div
          className={`absolute top-1/3 left-1/4 w-[550px] h-[550px] rounded-full bg-blue-600 blur-[120px] mix-blend-screen animate-neon-orb-c ${
            isLogin ? 'opacity-55' : 'opacity-35'
          }`}
        />

        {/* Neon Orb 4: Subtle Golden Yellow Glow (#eab308) */}
        <div
          className={`absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-amber-400 blur-[110px] mix-blend-screen animate-neon-orb-a ${
            isLogin ? 'opacity-35' : 'opacity-25'
          }`}
        />

        {/* Slow Moving Neon Ribbon Wave Layer 1 */}
        <div
          className={`absolute -inset-20 bg-cover bg-center bg-no-repeat animate-neon-drift-1 filter invert hue-rotate-190 saturate-200 contrast-125 ${
            isLogin ? 'opacity-75' : 'opacity-50'
          }`}
          style={{
            backgroundImage: "url('/bg_wave.png')",
          }}
        />

        {/* Slow Moving Neon Ribbon Wave Layer 2 (Cross-Drift for ethereal slow depth) */}
        <div
          className={`absolute -inset-24 bg-cover bg-center bg-no-repeat animate-neon-drift-2 filter invert hue-rotate-260 saturate-250 mix-blend-screen ${
            isLogin ? 'opacity-55' : 'opacity-35'
          }`}
          style={{
            backgroundImage: "url('/bg_wave.png')",
          }}
        />
      </div>

      {/* Cyber Radial Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/30 to-[#030712]/80" />

      {/* Main app screen overlay: soft blur maintaining high contrast for cards, tables, and text */}
      {!isLogin && (
        <div className="absolute inset-0 bg-[#030712]/55 backdrop-blur-[2px]" />
      )}
    </div>
  );
};

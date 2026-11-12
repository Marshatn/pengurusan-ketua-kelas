import React from 'react';

interface NeonBackgroundProps {
  variant?: 'login' | 'app';
}

export const NeonBackground: React.FC<NeonBackgroundProps> = ({ variant = 'app' }) => {
  const isLogin = variant === 'login';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#D8D8EC]">
      {/* Dynamic Animated Diagonal Ribbon Background (Derived from user attachment image_3324324a.png) */}
      <div className="absolute inset-0">
        {/* Ambient Underglow Orbs matching the soft lavender & icy blue hues */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-300/50 blur-[130px] animate-neon-orb-a" />
        <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full bg-violet-200/60 blur-[140px] animate-neon-orb-b" />

        {/* Primary Moving Layer 1: Diagonal Gradient Bands */}
        <div
          className={`absolute -inset-16 bg-cover bg-center bg-no-repeat animate-diagonal-flow-1 filter saturate-110 contrast-105 ${
            isLogin ? 'opacity-95' : 'opacity-85'
          }`}
          style={{
            backgroundImage: "url('/assets/aistudio/image_3324324a.png')",
          }}
        />

        {/* Secondary Moving Layer 2: Diagonal Flow Drift for Multidimensional Fluid Depth */}
        <div
          className="absolute -inset-20 bg-cover bg-center bg-no-repeat animate-diagonal-flow-2 filter saturate-125 opacity-40 mix-blend-color-burn"
          style={{
            backgroundImage: "url('/assets/aistudio/image_3324324a.png')",
          }}
        />

        {/* Diagonal Light Shimmer Beam traveling along the angled bands */}
        <div className="absolute -inset-full bg-gradient-to-br from-transparent via-white/30 to-transparent pointer-events-none animate-diagonal-shimmer" />
      </div>

      {/* Gentle Radial Vignette for Balanced Center Contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-900/15" />

      {/* Paparan Main Menu & Login Overlay: Maintains pristine contrast for all text, cards & buttons */}
      <div
        className={`absolute inset-0 ${
          isLogin ? 'bg-slate-950/15 backdrop-blur-[0.5px]' : 'bg-white/20 backdrop-blur-[0.5px]'
        }`}
      />
    </div>
  );
};

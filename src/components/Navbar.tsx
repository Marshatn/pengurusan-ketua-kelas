import React from 'react';
import { School, LogOut, User, Calendar, Award, BookOpen, BarChart3, Settings, Users, Globe } from 'lucide-react';
import { UserSession } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { t } from '../translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  user: UserSession;
  onLogout: () => void;
  lang: 'ms' | 'zh';
  setLang: (lang: 'ms' | 'zh') => void;
}

const YEARS = [2026, 2027, 2028, 2029, 2030];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  user,
  onLogout,
  lang,
  setLang,
}) => {
  const dict = t[lang];

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-amber-400/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Zone 1: Brand Wordmark with Deep Navy & Golden Yellow */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-300 overflow-hidden">
              <img
                src="/assets/aistudio/school_logo_466b8a00.png"
                alt="Logo SJK (C) Chung Hwa Kota Belud"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-tight flex items-center gap-2">
                <span>{dict.appName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-bold uppercase">SJKC</span>
              </h1>
              <p className="text-[11px] font-medium text-amber-300">
                {dict.subTitle}
              </p>
            </div>
          </div>

          {/* Academic Year Switcher */}
          <div className="hidden lg:flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-amber-400/30 shadow-inner">
            <span className="text-[11px] font-bold text-amber-400 px-2.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {dict.session}
            </span>
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3.5 py-1 text-xs font-extrabold rounded-lg transition-all ${
                  selectedYear === y
                    ? 'bg-[#EAB308] text-[#0F172A] shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Right Actions: Language Switcher + PWA Install + Logout */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'ms' ? 'zh' : 'ms')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-xl transition shadow-xs"
              title="Tukar Bahasa / 切换语言"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ms' ? '中文 (ZH)' : 'Bahasa Melayu (MS)'}</span>
            </button>

            <PWAInstallButton />

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 rounded-xl transition"
              title={dict.logout}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{dict.logout}</span>
            </button>
          </div>
        </div>

        {/* Mobile Year Switcher Row */}
        <div className="flex lg:hidden items-center justify-between py-2.5 border-t border-slate-800">
          <span className="text-xs font-semibold text-amber-300">{dict.session}</span>
          <div className="flex items-center gap-1">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                  selectedYear === y ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'classes'
                ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{dict.tabs.classes}</span>
          </button>

          <button
            onClick={() => setActiveTab('voting')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'voting'
                ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{dict.tabs.voting}</span>
          </button>

          <button
            onClick={() => setActiveTab('sop')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'sop'
                ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{dict.tabs.sop}</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{dict.tabs.leaderboard}</span>
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{dict.tabs.admin}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

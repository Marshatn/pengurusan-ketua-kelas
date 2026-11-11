import React from 'react';
import { School, LogOut, User, Calendar, Award, BookOpen, BarChart3, Settings, Users, Globe, Lock } from 'lucide-react';
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
  const currentYear = new Date().getFullYear();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-amber-400/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Zone 1: Brand Wordmark with Deep Navy & Golden Yellow */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-300 overflow-hidden shrink-0">
                <img
                  src="/school_logo.jpg"
                  alt="Logo SJK (C) Chung Hwa Kota Belud"
                  className="w-full h-full object-contain p-0.5"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-xs sm:text-base font-extrabold text-white tracking-tight leading-tight line-clamp-1">
                  {dict.appName}
                </h1>
                <p className="text-[10px] sm:text-[11px] font-medium text-amber-300 line-clamp-1">
                  {dict.subTitle}
                </p>
              </div>
            </div>

            {/* Academic Year Switcher - Desktop */}
            <div className="hidden lg:flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-amber-400/30 shadow-inner">
              <span className="text-[11px] font-bold text-amber-400 px-2.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {dict.session}
              </span>
              {YEARS.map((y) => {
                const isCurrentYear = y === currentYear;
                return (
                  <button
                    key={y}
                    disabled={!isCurrentYear}
                    onClick={() => {
                      if (isCurrentYear) setSelectedYear(y);
                    }}
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 ${
                      selectedYear === y
                        ? 'bg-[#EAB308] text-[#0F172A] shadow-md scale-105'
                        : !isCurrentYear
                        ? 'text-slate-500 opacity-40 cursor-not-allowed'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                    title={
                      isCurrentYear
                        ? `Sesi Semasa (${y})`
                        : `Tahun ${y} belum dibuka. Hanya sesi tahun semasa (${currentYear}) dibenarkan.`
                    }
                  >
                    <span>{y}</span>
                    {!isCurrentYear && <Lock className="w-2.5 h-2.5 opacity-60" />}
                  </button>
                );
              })}
            </div>

            {/* Right Actions: PWA Install + Language Switcher + Logout */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* PWA Install Button */}
              <PWAInstallButton lang={lang} />

              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'ms' ? 'zh' : 'ms')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-xl transition shadow-xs cursor-pointer"
                title="Tukar Bahasa / 切换语言"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{lang === 'ms' ? '中文' : 'BM'}</span>
                <span className="sm:hidden">{lang === 'ms' ? 'ZH' : 'BM'}</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 rounded-xl transition cursor-pointer"
                title={dict.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{dict.logout}</span>
              </button>
            </div>
          </div>

          {/* Mobile Year Switcher Row */}
          <div className="flex lg:hidden items-center justify-between py-2 border-t border-slate-800 text-xs">
            <span className="font-semibold text-amber-300">{dict.session} {selectedYear}</span>
            <div className="flex items-center gap-1">
              {YEARS.map((y) => {
                const isCurrentYear = y === currentYear;
                return (
                  <button
                    key={y}
                    disabled={!isCurrentYear}
                    onClick={() => {
                      if (isCurrentYear) setSelectedYear(y);
                    }}
                    className={`px-2 py-0.5 text-xs font-bold rounded-md flex items-center gap-0.5 ${
                      selectedYear === y
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-600 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span>{y}</span>
                    {!isCurrentYear && <Lock className="w-2 h-2 opacity-50" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Tab Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800">
            <button
              onClick={() => setActiveTab('classes')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Mobile Bottom Navigation Bar (Super easy to view and effective on smartphones) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-xl border-t border-amber-400/30 px-2 py-1.5 flex justify-around items-center shadow-2xl safe-area-pb">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'classes'
              ? 'text-amber-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{lang === 'ms' ? 'Kelas' : '班级'}</span>
        </button>

        <button
          onClick={() => setActiveTab('voting')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'voting'
              ? 'text-amber-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{lang === 'ms' ? 'Undian' : '投票'}</span>
        </button>

        <button
          onClick={() => setActiveTab('sop')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'sop'
              ? 'text-amber-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">SOP</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'leaderboard'
              ? 'text-amber-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">{lang === 'ms' ? 'Keputusan' : '结果'}</span>
        </button>

        {user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
              activeTab === 'admin'
                ? 'text-amber-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Admin</span>
          </button>
        )}
      </nav>
    </>
  );
};

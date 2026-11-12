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
  const currentYear = 2026;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-amber-400/30 shadow-md w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-3">
            {/* Zone 1: Brand Wordmark with Deep Navy & Golden Yellow */}
            <div
              onClick={() => setActiveTab('voting')}
              className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 cursor-pointer"
              title="Pergi ke Pengundian Pemimpin Murid"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-300 overflow-hidden shrink-0">
                <img
                  src="/school_logo.jpg"
                  alt="Logo SJK (C) Chung Hwa Kota Belud"
                  className="w-full h-full object-contain p-0.5"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-[11px] sm:text-base font-extrabold text-white tracking-tight leading-tight truncate">
                  {dict.appName}
                </h1>
                <p className="text-[9px] sm:text-[11px] font-medium text-amber-300 truncate">
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

            {/* Right Actions: User Name Badge + Language Switcher + Logout */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* User Name Badge (Desktop only) */}
              <div className="hidden md:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-amber-400/30 text-xs text-amber-300 font-bold shadow-inner">
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="line-clamp-1 max-w-[180px]">{user.name}</span>
              </div>

              {/* Language Toggle: Ultra compact so can view all in 1 page */}
              <button
                onClick={() => setLang(lang === 'ms' ? 'zh' : 'ms')}
                className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-lg sm:rounded-xl transition shadow-xs cursor-pointer shrink-0"
                title="Tukar Bahasa / 切换语言"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                <span>{lang === 'ms' ? '中文' : 'BM'}</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 rounded-lg sm:rounded-xl transition cursor-pointer shrink-0"
                title={dict.logout}
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden md:inline">{dict.logout}</span>
              </button>
            </div>
          </div>

          {/* Mobile Year Switcher Row - Compact single row without overflowing buttons */}
          <div className="flex lg:hidden items-center justify-between py-1 border-t border-slate-800 text-[11px] gap-2">
            <span className="font-bold text-amber-300 truncate flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{dict.session} {selectedYear}</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-[#EAB308] text-slate-950 font-mono shadow-xs shrink-0">
              Sesi {selectedYear} Aktif
            </span>
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
              onClick={() => {
                if (user.role === 'admin') setActiveTab('leaderboard');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                user.role !== 'admin'
                  ? 'text-slate-500 bg-slate-800/40 opacity-70 cursor-not-allowed'
                  : activeTab === 'leaderboard'
                  ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold cursor-pointer'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white cursor-pointer'
              }`}
              title={user.role !== 'admin' ? 'Akses Terhad Pentadbir (Locked)' : ''}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{dict.tabs.leaderboard}</span>
              {user.role !== 'admin' && <Lock className="w-3 h-3 ml-1 text-amber-400" />}
            </button>

            <button
              onClick={() => {
                if (user.role === 'admin') setActiveTab('admin');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                user.role !== 'admin'
                  ? 'text-slate-500 bg-slate-800/40 opacity-70 cursor-not-allowed'
                  : activeTab === 'admin'
                  ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold cursor-pointer'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white cursor-pointer'
              }`}
              title={user.role !== 'admin' ? 'Akses Terhad Pentadbir (Locked)' : ''}
            >
              <Settings className="w-4 h-4" />
              <span>{dict.tabs.admin}</span>
              {user.role !== 'admin' && <Lock className="w-3 h-3 ml-1 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Optimized for smartphones and touch devices) */}
      {/* Mobile Bottom Navigation Bar (Guaranteed visible immediately upon login, fits 100% within mobile viewport) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A]/98 backdrop-blur-xl border-t border-amber-400/40 px-1 py-1 flex items-center justify-around shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)] safe-area-pb w-full max-w-full overflow-hidden transform-gpu">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[46px] ${
            activeTab === 'classes'
              ? 'text-amber-400 font-black bg-slate-800/80 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate max-w-full">{lang === 'ms' ? 'Kelas' : '班级'}</span>
        </button>

        <button
          onClick={() => setActiveTab('voting')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[46px] ${
            activeTab === 'voting'
              ? 'text-amber-400 font-black bg-slate-800/80 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate max-w-full">{lang === 'ms' ? 'Undian' : '投票'}</span>
        </button>

        <button
          onClick={() => setActiveTab('sop')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[46px] ${
            activeTab === 'sop'
              ? 'text-amber-400 font-black bg-slate-800/80 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate max-w-full">SOP</span>
        </button>

        {user.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[46px] ${
                activeTab === 'leaderboard'
                  ? 'text-amber-400 font-black bg-slate-800/80 shadow-xs'
                : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight truncate max-w-full">{lang === 'ms' ? 'Hasil' : '结果'}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition cursor-pointer min-h-[46px] ${
                activeTab === 'admin'
                  ? 'text-amber-400 font-black bg-slate-800/80 shadow-xs'
                : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight truncate max-w-full">Admin</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};

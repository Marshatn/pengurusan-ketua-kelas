import React from 'react';
import { CheckCircle2, Award, Sparkles, Check, ChevronRight } from 'lucide-react';
import { VoteRecord, VoteCategory } from '../types';

interface VotingProgressBarProps {
  userVotes: VoteRecord[];
  categories: {
    id: VoteCategory;
    label: string;
    isKetua: boolean;
    isTahap1: boolean;
  }[];
  currentCategoryIndex: number;
  onSelectCategory: (index: number) => void;
  lang: 'ms' | 'zh';
}

export const VotingProgressBar: React.FC<VotingProgressBarProps> = ({
  userVotes,
  categories,
  currentCategoryIndex,
  onSelectCategory,
  lang,
}) => {
  const completedCount = categories.filter((cat) =>
    userVotes.some((v) => v.category === cat.id)
  ).length;

  const totalCategories = categories.length || 4;
  const percentage = Math.round((completedCount / totalCategories) * 100);

  // Motivational feedback message based on progress
  const getProgressMessage = () => {
    if (completedCount === 0) {
      return lang === 'ms'
        ? 'Sila mulakan undian bagi Kategori 1 di bawah'
        : '请开始下方第 1 类别的投票';
    }
    if (completedCount === 1) {
      return lang === 'ms'
        ? 'Bagus! 1 kategori selesai, baki 3 lagi'
        : '太棒了！已完成 1 个类别，还剩 3 个';
    }
    if (completedCount === 2) {
      return lang === 'ms'
        ? 'Separuh jalan! 2 kategori selesai, baki 2 lagi'
        : '进度过半！已完成 2 个类别，还剩 2 个';
    }
    if (completedCount === 3) {
      return lang === 'ms'
        ? 'Hampir siap! Tinggal 1 kategori terakhir'
        : '即将完成！仅剩最后 1 个类别';
    }
    return lang === 'ms'
      ? 'Tahniah! Semua 4 kategori telah lengkap diundi'
      : '恭喜！全部 4 个类别已完成投票';
  };

  return (
    <div className="bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-amber-400/35 p-3.5 sm:p-5 shadow-xl text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-36 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title & Percentage */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
            {completedCount === 4 ? (
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            ) : (
              <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            )}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>{lang === 'ms' ? 'Kemajuan Undian Anda' : '您的投票进度'}</span>
              <span className="font-mono text-[11px] sm:text-xs text-amber-300">
                ({completedCount} / {totalCategories})
              </span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-amber-200/80 font-medium line-clamp-1">
              {getProgressMessage()}
            </p>
          </div>
        </div>

        {/* Big Percentage Badge */}
        <div className="text-right shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-black font-mono shadow-xs border ${
              completedCount === 4
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : completedCount > 0
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {completedCount === 4 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{percentage}%</span>
          </span>
        </div>
      </div>

      {/* Modern Multi-Segment Progress Bar Track */}
      <div className="relative w-full h-3 sm:h-3.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/80 shadow-inner my-2.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-md ${
            completedCount === 4
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300'
          }`}
          style={{ width: `${Math.max(percentage, completedCount > 0 ? 8 : 0)}%` }}
        />
      </div>

      {/* 4 Interactive Category Step Cards / Indicators */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1">
        {categories.map((cat, idx) => {
          const isVoted = userVotes.some((v) => v.category === cat.id);
          const isCurrent = currentCategoryIndex === idx;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(idx)}
              className={`p-1.5 sm:p-2 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer min-h-[46px] sm:min-h-[52px] ${
                isVoted
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                  : isCurrent
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
                  : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-0.5">
                <span
                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1 py-0.2 rounded ${
                    isVoted
                      ? 'bg-emerald-950/80 text-emerald-300'
                      : isCurrent
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  K{idx + 1}
                </span>

                {isVoted ? (
                  <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-300 shrink-0" />
                ) : (
                  <span className={`text-[8px] sm:text-[9px] font-mono ${isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {isCurrent ? 'Kini' : 'Belum'}
                  </span>
                )}
              </div>

              <span className="text-[9px] sm:text-[10.5px] font-bold truncate max-w-full leading-tight">
                {cat.isKetua ? 'Ketua' : 'Penolong'} {cat.isTahap1 ? 'T1' : 'T2'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Award, BarChart3, Sparkles } from 'lucide-react';
import { VoteRecord, ClassLeaderData } from '../types';
import { t } from '../translations';

interface TabLeaderboardProps {
  votes: VoteRecord[];
  classesData: ClassLeaderData[];
  selectedYear: number;
  lang: 'ms' | 'zh';
}

export const TabLeaderboard: React.FC<TabLeaderboardProps> = ({ votes, classesData, selectedYear, lang }) => {
  const [activeCategory, setActiveCategory] = useState<'ketua' | 'penolong'>('ketua');

  const dict = t[lang].leaderboardTab;

  const yearVotes = votes.filter((v) => v.year === selectedYear && v.category === activeCategory);
  const totalCategoryVotes = yearVotes.length;

  const candidateCounts: { [name: string]: { name: string; count: number; classId: string } } = {};

  classesData.forEach((cls) => {
    const name = activeCategory === 'ketua' ? cls.headPrefect : cls.assistantPrefect;
    if (name && name.trim() !== '') {
      candidateCounts[name] = { name, count: 0, classId: cls.id };
    }
  });

  yearVotes.forEach((v) => {
    if (candidateCounts[v.candidateName]) {
      candidateCounts[v.candidateName].count += 1;
    } else {
      candidateCounts[v.candidateName] = { name: v.candidateName, count: 1, classId: v.classId };
    }
  });

  const rankedCandidates = Object.values(candidateCounts).sort((a, b) => b.count - a.count);
  const uniqueVoters = new Set(votes.filter((v) => v.year === selectedYear).map((v) => v.voterId)).size;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-3xl border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
        <div>
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-400 text-slate-950 mb-3 inline-block">
            {dict.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {dict.title} ({selectedYear})
          </h2>
          <p className="text-xs text-amber-200/80 mt-1">
            {dict.desc}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-400/30 text-center">
            <p className="text-[11px] font-bold text-amber-300 uppercase">{dict.totalVotes}</p>
            <p className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5">{totalCategoryVotes}</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-400/30 text-center">
            <p className="text-[11px] font-bold text-amber-300 uppercase">{dict.activeVoters}</p>
            <p className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5">{uniqueVoters}</p>
          </div>
        </div>
      </div>

      {/* Category Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveCategory('ketua')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition shadow-sm ${
            activeCategory === 'ketua'
              ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t[lang].votingTab.ketuaCategory}</span>
        </button>

        <button
          onClick={() => setActiveCategory('penolong')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition shadow-sm ${
            activeCategory === 'penolong'
              ? 'bg-[#EAB308] text-[#0F172A] shadow-lg shadow-amber-500/20 font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t[lang].votingTab.penolongCategory}</span>
        </button>
      </div>

      {/* Top 3 Podium Showcase with Golden Yellow / Deep Navy */}
      {rankedCandidates.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 2nd Place (Silver) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center relative order-2 md:order-1 flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-bold flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-slate-900">
              🥈 2
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mx-auto mb-3 text-2xl font-extrabold shadow-inner">
                {rankedCandidates[1]?.name.charAt(0)}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{rankedCandidates[1]?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kelas: {rankedCandidates[1]?.classId}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xl font-extrabold font-mono text-slate-700 dark:text-slate-300">{rankedCandidates[1]?.count} Undian</span>
            </div>
          </div>

          {/* 1st Place (Gold Podium with Golden Yellow) */}
          <div className="bg-gradient-to-b from-amber-500/20 via-transparent to-transparent rounded-3xl border-2 border-amber-400 p-6 shadow-xl text-center relative order-1 md:order-2 flex flex-col justify-between transform md:-translate-y-4">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#EAB308] text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-lg border-2 border-white dark:border-slate-900">
              🥇 1
            </div>
            <div>
              <div className="w-20 h-20 rounded-full bg-[#EAB308] text-slate-950 flex items-center justify-center mx-auto mb-3 text-3xl font-extrabold shadow-lg border-2 border-amber-300">
                {rankedCandidates[0]?.name.charAt(0)}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{rankedCandidates[0]?.name}</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">Juara Kategori ({rankedCandidates[0]?.classId})</p>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/40">
              <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{rankedCandidates[0]?.count} Undian</span>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center relative order-3 md:order-3 flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-slate-900">
              🥉 3
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 text-2xl font-extrabold shadow-inner">
                {rankedCandidates[2]?.name.charAt(0)}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{rankedCandidates[2]?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kelas: {rankedCandidates[2]?.classId}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xl font-extrabold font-mono text-slate-700 dark:text-slate-300">{rankedCandidates[2]?.count} Undian</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <span>{dict.fullList}</span>
        </h3>

        <div className="space-y-4">
          {rankedCandidates.map((cand, idx) => {
            const percentage = totalCategoryVotes > 0 ? Math.round((cand.count / totalCategoryVotes) * 100) : 0;
            return (
              <div key={cand.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cand.name}</h4>
                      <p className="text-[11px] text-slate-500">Kelas: {cand.classId}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{cand.count} undi</span>
                    <span className="text-xs text-slate-400 ml-2">({percentage}%)</span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

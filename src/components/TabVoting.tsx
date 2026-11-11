import React, { useState } from 'react';
import { Award, CheckCircle2, Lock, Unlock, Sparkles, ThumbsUp } from 'lucide-react';
import { ClassLeaderData, VoteRecord, UserSession, SystemSettings } from '../types';
import { t } from '../translations';

interface TabVotingProps {
  classesData: ClassLeaderData[];
  votes: VoteRecord[];
  onCastVote: (vote: Omit<VoteRecord, 'id' | 'timestamp'>) => void;
  selectedYear: number;
  user: UserSession;
  settings: SystemSettings;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: 'ms' | 'zh';
}

export const TabVoting: React.FC<TabVotingProps> = ({
  classesData,
  votes,
  onCastVote,
  selectedYear,
  user,
  settings,
  addToast,
  lang,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ketua' | 'penolong'>('ketua');
  const [confirmModalCandidate, setConfirmModalCandidate] = useState<{
    name: string;
    classId: string;
    category: 'ketua' | 'penolong';
  } | null>(null);

  const dict = t[lang].votingTab;

  const candidates = classesData.map((cls) => ({
    classId: cls.id,
    className: cls.name,
    name: activeCategory === 'ketua' ? cls.headPrefect : cls.assistantPrefect,
  })).filter((c) => c.name && c.name.trim() !== '');

  const userVotesInYear = votes.filter(
    (v) => v.year === selectedYear && v.voterId === user.username
  );
  const hasVotedKetua = userVotesInYear.some((v) => v.category === 'ketua');
  const hasVotedPenolong = userVotesInYear.some((v) => v.category === 'penolong');

  const currentCategoryVoted = activeCategory === 'ketua' ? hasVotedKetua : hasVotedPenolong;

  const handleConfirmVote = () => {
    if (!confirmModalCandidate) return;

    if (!settings.votingOpen && user.role !== 'admin') {
      addToast('Undian telah ditutup oleh pihak pentadbir.', 'error');
      setConfirmModalCandidate(null);
      return;
    }

    onCastVote({
      year: selectedYear,
      voterId: user.username,
      category: confirmModalCandidate.category,
      candidateName: confirmModalCandidate.name,
      classId: confirmModalCandidate.classId,
    });

    addToast(`Berjaya mengundi ${confirmModalCandidate.name}!`, 'success');
    setConfirmModalCandidate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Deep Navy & Golden Yellow */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-amber-400/30">
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none text-amber-400">
          <Award className="w-56 h-56" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              settings.votingOpen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {settings.votingOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {settings.votingOpen ? `${dict.votingOpen} (${selectedYear})` : dict.votingClosed}
            </span>
            <span className="text-xs text-amber-300 font-mono">ID: {user.username} ({user.role})</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{dict.bannerTitle}</h2>
          <p className="text-sm text-amber-200/90 mt-1 max-w-2xl">
            {dict.bannerDesc}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
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
          <span>{dict.ketuaCategory}</span>
          {hasVotedKetua && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-1" />}
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
          <span>{dict.penolongCategory}</span>
          {hasVotedPenolong && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-1" />}
        </button>
      </div>

      {currentCategoryVoted && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{dict.votedNotice}</span>
        </div>
      )}

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((cand, idx) => {
          const candidateVotesCount = votes.filter(
            (v) =>
              v.year === selectedYear &&
              v.category === activeCategory &&
              v.candidateName === cand.name
          ).length;

          return (
            <div
              key={`${cand.classId}-${idx}`}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {cand.className}
                  </span>
                  <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900">
                    {candidateVotesCount} Undi
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center text-lg shadow-md border border-amber-300">
                    {cand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                      {cand.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{activeCategory === 'ketua' ? 'Ketua Kelas' : 'Penolong Ketua Kelas'}</p>
                  </div>
                </div>
              </div>

              <button
                disabled={currentCategoryVoted || (!settings.votingOpen && user.role !== 'admin')}
                onClick={() =>
                  setConfirmModalCandidate({
                    name: cand.name,
                    classId: cand.classId,
                    category: activeCategory,
                  })
                }
                className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
                  currentCategoryVoted || (!settings.votingOpen && user.role !== 'admin')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0F172A] hover:bg-slate-800 text-amber-400 shadow-lg border border-amber-400/40'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{currentCategoryVoted ? dict.votedBtn : dict.voteBtn}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-4 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">{dict.confirmTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
              {dict.confirmDesc} <strong>{confirmModalCandidate.name}</strong>?
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-xl mt-4 text-center">
              {dict.confirmWarning}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setConfirmModalCandidate(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition"
              >
                {dict.cancel}
              </button>
              <button
                onClick={handleConfirmVote}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#EAB308] hover:bg-amber-500 text-slate-950 text-xs font-extrabold shadow-lg transition"
              >
                {dict.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

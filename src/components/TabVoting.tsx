import React, { useState } from 'react';
import { Award, CheckCircle2, Lock, Unlock, Sparkles, ThumbsUp } from 'lucide-react';
import { ClassLeaderData, VoteRecord, UserSession, SystemSettings, VoteCategory } from '../types';
import { TeacherVoterList } from './TeacherVoterList';
import { t } from '../translations';

interface TabVotingProps {
  classesData: ClassLeaderData[];
  votes: VoteRecord[];
  onCastVote: (vote: Omit<VoteRecord, 'id' | 'timestamp'>) => void | Promise<void>;
  selectedYear: number;
  user: UserSession;
  settings: SystemSettings;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: 'ms' | 'zh';
  teachers: string[];
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
  teachers,
}) => {
  const [activeCategory, setActiveCategory] = useState<VoteCategory>('ketua_tahap1');
  const [confirmModalCandidate, setConfirmModalCandidate] = useState<{
    name: string;
    classId: string;
    category: VoteCategory;
  } | null>(null);

  const dict = t[lang].votingTab;

  const CATEGORIES: { id: VoteCategory; label: string; scope: string; isKetua: boolean; isTahap1: boolean }[] = [
    {
      id: 'ketua_tahap1',
      label: dict.ketuaTahap1,
      scope: dict.scopeTahap1,
      isKetua: true,
      isTahap1: true,
    },
    {
      id: 'ketua_tahap2',
      label: dict.ketuaTahap2,
      scope: dict.scopeTahap2,
      isKetua: true,
      isTahap1: false,
    },
    {
      id: 'penolong_tahap1',
      label: dict.penolongTahap1,
      scope: dict.scopeTahap1,
      isKetua: false,
      isTahap1: true,
    },
    {
      id: 'penolong_tahap2',
      label: dict.penolongTahap2,
      scope: dict.scopeTahap2,
      isKetua: false,
      isTahap1: false,
    },
  ];

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  // Tahap 1: Grades 1 - 3, Tahap 2: Grade 6
  const eligibleClasses = classesData.filter((cls) => {
    if (currentCategoryObj.isTahap1) {
      return cls.grade >= 1 && cls.grade <= 3;
    } else {
      return cls.grade === 6;
    }
  });

  const candidates = eligibleClasses
    .map((cls) => ({
      classId: cls.id,
      className: cls.name,
      name: currentCategoryObj.isKetua ? cls.headPrefect : cls.assistantPrefect,
      roleTitle: currentCategoryObj.isKetua ? 'Ketua Kelas' : 'Penolong Ketua Kelas',
    }))
    .filter((c) => c.name && c.name.trim() !== '');

  const userVotesInYear = votes.filter(
    (v) => v.year === selectedYear && v.voterId === user.username
  );

  const currentCategoryVoted = userVotesInYear.some((v) => v.category === activeCategory);

  const handleConfirmVote = async () => {
    if (!confirmModalCandidate) return;

    if (!settings.votingOpen && user.role !== 'admin') {
      addToast('Undian telah ditutup oleh pihak pentadbir.', 'error');
      setConfirmModalCandidate(null);
      return;
    }

    const candidate = confirmModalCandidate;
    setConfirmModalCandidate(null);

    await onCastVote({
      year: selectedYear,
      voterId: user.username,
      voterName: user.name,
      category: candidate.category,
      candidateName: candidate.name,
      classId: candidate.classId,
    });
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
            {/* ID display removed per user request */}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{dict.bannerTitle}</h2>
          <p className="text-sm text-amber-200/90 mt-1 max-w-2xl">
            {dict.bannerDesc}
          </p>
        </div>
      </div>

      {/* 4 Category Selection Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const isVoted = userVotesInYear.some((v) => v.category === cat.id);
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-2xl text-left transition flex flex-col justify-between border relative ${
                isActive
                  ? 'bg-[#EAB308] text-[#0F172A] border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#0F172A] text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat.isTahap1 ? 'TAHAP I' : 'TAHAP II (Tahun 6)'}
                  </span>
                  {isVoted && (
                    <span
                      className={`flex items-center gap-1 text-[11px] font-bold ${
                        isActive ? 'text-slate-950 font-black' : 'text-emerald-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{dict.votedBtn}</span>
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-black leading-tight">{cat.label}</h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Header Card */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAB308] text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            {currentCategoryObj.isKetua ? <Award className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {currentCategoryObj.label}
            </h3>
          </div>
        </div>

        {currentCategoryVoted && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{dict.votedNotice}</span>
          </div>
        )}
      </div>

      {/* Candidates Grid - Alphabet badge removed, ONLY student's name displayed */}
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
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg shadow-xs ${
                    cand.className.toUpperCase().includes('MERAH') || cand.classId.endsWith('M')
                      ? 'bg-red-500 text-white' 
                      : cand.className.toUpperCase().includes('BIRU') || cand.classId.endsWith('B')
                      ? 'bg-blue-500 text-white'
                      : 'bg-amber-400 text-slate-950'
                  }`}>
                    {cand.className}
                  </span>
                  <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900">
                    {candidateVotesCount} Undi
                  </span>
                </div>

                {/* Only Student Name displayed clearly without single-letter alphabet avatar */}
                <div className="py-2 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {cand.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Jawatan: <span className="font-semibold text-slate-700 dark:text-slate-300">{cand.roleTitle}</span>
                  </p>
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
                className={`w-full py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
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

      {/* Teachers Who Have Voted (Confidential - Student selection hidden) */}
      <TeacherVoterList
        votes={votes}
        teachers={teachers}
        selectedYear={selectedYear}
        lang={lang}
      />

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

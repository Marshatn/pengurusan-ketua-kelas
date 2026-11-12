import React, { useState } from 'react';
import { Award, CheckCircle2, Lock, Unlock, Sparkles, ThumbsUp, LogOut, Check, ArrowRight } from 'lucide-react';
import { ClassLeaderData, VoteRecord, UserSession, SystemSettings, VoteCategory, TeacherRecord } from '../types';
import { TeacherVoterList } from './TeacherVoterList';
import { sortClassesMerahKuningBiru } from '../data/initialData';
import { t } from '../translations';

interface TabVotingProps {
  classesData: ClassLeaderData[];
  votes: VoteRecord[];
  onCastVote: (vote: Omit<VoteRecord, 'id' | 'timestamp'>) => void | Promise<void>;
  onLogout: () => void;
  currentCategoryIndex: number;
  setCurrentCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedYear: number;
  user: UserSession;
  settings: SystemSettings;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: 'ms' | 'zh';
  teachers: (TeacherRecord | string)[];
}

export const TabVoting: React.FC<TabVotingProps> = ({
  classesData,
  votes,
  onCastVote,
  onLogout,
  currentCategoryIndex,
  setCurrentCategoryIndex,
  selectedYear,
  user,
  settings,
  addToast,
  lang,
  teachers,
}) => {
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

  const currentCategoryObj = CATEGORIES[currentCategoryIndex] || CATEGORIES[0];
  const activeCategory = currentCategoryObj.id;

  // Tahap 1: Grades 1 - 3, Tahap 2: Grade 6 - Sorted starting from Merah, Kuning, and Biru
  const eligibleClasses = sortClassesMerahKuningBiru(
    classesData.filter((cls) => {
      if (currentCategoryObj.isTahap1) {
        return cls.grade >= 1 && cls.grade <= 3;
      } else {
        return cls.grade === 6;
      }
    })
  );

  const candidates = eligibleClasses
    .map((cls) => ({
      classId: cls.id,
      className: cls.name,
      name: currentCategoryObj.isKetua ? cls.headPrefect : cls.assistantPrefect,
      roleTitle: currentCategoryObj.isKetua ? 'Ketua Kelas' : 'Penolong Ketua Kelas',
    }))
    .filter((c) => c.name && c.name.trim() !== '');

  // User's votes across the academic year
  const userVotesInYear = votes.filter(
    (v) => v.year === selectedYear && v.voterId === user.username
  );

  // Current category vote for this voter (if any)
  const currentCategoryVote = userVotesInYear.find((v) => v.category === activeCategory);
  const currentCategoryVoted = !!currentCategoryVote;

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
    <div className="space-y-3 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Header Banner - Clean and professional, removed debug/extra buttons */}
      <div className="bg-[#0F172A] p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl text-white shadow-xl relative overflow-hidden border border-amber-400/30">
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none text-amber-400">
          <Award className="w-56 h-56" />
        </div>
        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              settings.votingOpen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {settings.votingOpen ? <Unlock className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> : <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />}
              {settings.votingOpen ? `${dict.votingOpen} (${selectedYear})` : dict.votingClosed}
            </span>

            <span className="text-[11px] sm:text-xs text-amber-300 font-semibold">
              Status Anda: <strong className="text-white font-mono">{userVotesInYear.length} / 4</strong> Kategori Selesai
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white">{dict.bannerTitle}</h2>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-1 max-w-2xl">
              {dict.bannerDesc}
            </p>
          </div>

          {/* Teacher Identity & Confidentiality Notice */}
          <div className="flex items-center justify-between flex-wrap gap-1.5 pt-2.5 sm:pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-300">
            <div>
              Guru Mengundi: <strong className="text-white font-bold">{user.name}</strong>
              <span className="font-mono text-amber-400 ml-1.5 text-[10px] sm:text-[11px]">({user.username})</span>
            </div>
            <div className="text-slate-400 text-[10px] sm:text-[11px]">
              Setiap undian adalah <strong className="text-amber-400">MUKTAMAD</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Category Selection Buttons */}
      {(() => {
        const firstUnvotedIndex = CATEGORIES.findIndex((cat) => !userVotesInYear.some((v) => v.category === cat.id));

        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3">
            {CATEGORIES.map((cat, idx) => {
              const isVoted = userVotesInYear.some((v) => v.category === cat.id);
              const isActive = activeCategory === cat.id;
              const isMissed = !isVoted && firstUnvotedIndex !== -1 && idx < firstUnvotedIndex;

              let cardStyle = 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400/40';
              if (isVoted) {
                cardStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/30';
              } else if (isMissed) {
                cardStyle = 'bg-rose-600 text-white border-rose-500 shadow-md animate-pulse ring-2 ring-rose-400/40';
              } else if (isActive) {
                cardStyle = 'bg-[#EAB308] text-[#0F172A] border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50';
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (idx > firstUnvotedIndex && firstUnvotedIndex !== -1) {
                      addToast('Sila lengkapkan undian kategori terdahulu terlebih dahulu!', 'error');
                    }
                    setCurrentCategoryIndex(idx);
                  }}
                  className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-left transition flex flex-col justify-between border relative cursor-pointer min-h-[70px] sm:min-h-[76px] ${cardStyle}`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1 gap-1">
                      <span
                        className={`text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider px-1 sm:px-2 py-0.5 rounded truncate ${
                          isVoted || isMissed
                            ? 'bg-black/30 text-white'
                            : isActive
                            ? 'bg-[#0F172A] text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {cat.isTahap1 ? 'TAHAP 1' : 'TAHAP 2'}
                      </span>
                      {isVoted ? (
                        <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-white shrink-0">
                          <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-200" />
                          <span className="hidden sm:inline">{dict.votedBtn}</span>
                        </span>
                      ) : isMissed ? (
                        <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-extrabold text-white shrink-0">
                          <span>Terlepas!</span>
                        </span>
                      ) : null}
                    </div>
                    <h4 className="text-[10.5px] sm:text-xs font-black leading-snug line-clamp-2">{cat.label}</h4>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* Active Category Header Card - Locked once voted, no amendment can be made */}
      <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EAB308] text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            {currentCategoryObj.isKetua ? <Award className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
          <div>
            <h3 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white">
              {currentCategoryObj.label}
            </h3>
            {currentCategoryVote ? (
              <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Pilihan Muktamad: <strong className="text-slate-900 dark:text-white underline">{currentCategoryVote.candidateName}</strong> ({currentCategoryVote.classId})</span>
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sila klik butang undi pada calon pilihan anda. Undian adalah muktamad.
              </p>
            )}
          </div>
        </div>

        {/* Status for Active Category */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {currentCategoryVoted ? (
            <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Selesai (Muktamad)</span>
            </div>
          ) : (
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-800 dark:text-amber-300 text-[11px] sm:text-xs font-bold">
              Belum Mengundi
            </span>
          )}
        </div>
      </div>

      {/* Candidates Grid - Stretched to mobile view margins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
        {candidates.map((cand, idx) => {
          const candidateVotesCount = votes.filter(
            (v) =>
              v.year === selectedYear &&
              v.category === activeCategory &&
              v.candidateName === cand.name
          ).length;

          const isMyCurrentVote = currentCategoryVote?.candidateName === cand.name;

          return (
            <div
              key={`${cand.classId}-${idx}`}
              className={`rounded-2xl sm:rounded-3xl border p-3.5 sm:p-6 shadow-sm transition flex flex-col justify-between relative overflow-hidden ${
                isMyCurrentVote
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-400/50 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
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
                  
                  <div className="flex items-center gap-2">
                    {isMyCurrentVote && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3" />
                        <span>Pilihan Anda</span>
                      </span>
                    )}
                    <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900">
                      {candidateVotesCount} Undi
                    </span>
                  </div>
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

              {/* Vote Button: Locked once submitted. No amendment can be made. */}
              {isMyCurrentVote ? (
                <button
                  type="button"
                  disabled={true}
                  className="w-full py-3.5 px-4 min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-600 text-white shadow-md cursor-not-allowed border border-emerald-400/50 opacity-95"
                  title="Undian anda telah disahkan dan tidak boleh dipinda"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>✓ Undian Anda (Muktamad)</span>
                </button>
              ) : currentCategoryVoted ? (
                /* Other candidates are disabled because the category is already voted and final */
                <button
                  type="button"
                  disabled={true}
                  className="w-full py-3.5 px-4 min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                  title="Undian kategori ini telah selesai dan tidak boleh dipinda"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Undian Telah Dibuat</span>
                </button>
              ) : (
                /* Initial Vote */
                <button
                  type="button"
                  disabled={!settings.votingOpen && user.role !== 'admin'}
                  onClick={() =>
                    setConfirmModalCandidate({
                      name: cand.name,
                      classId: cand.classId,
                      category: activeCategory,
                    })
                  }
                  className={`w-full py-3.5 px-4 min-h-[48px] rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-98 ${
                    !settings.votingOpen && user.role !== 'admin'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-[#0F172A] hover:bg-slate-800 text-amber-400 shadow-lg border border-amber-400/40 cursor-pointer'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{dict.voteBtn}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner if all 4 categories voted */}
      {userVotesInYear.length === 4 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">Tahniah! Anda telah melengkapkan undian bagi semua 4 kategori.</h3>
            </div>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              className="w-full sm:w-auto px-5 py-3 min-h-[48px] rounded-xl bg-white text-slate-950 font-black text-xs sm:text-sm hover:bg-emerald-50 transition shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <LogOut className="w-4 h-4 text-emerald-700" />
              <span>Selesai & Log Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Teachers Who Have Voted (Confidential - Student selection hidden) */}
      <TeacherVoterList
        votes={votes}
        teachers={teachers}
        selectedYear={selectedYear}
        lang={lang}
      />

      {/* Confirmation Modal for Initial Vote - Clearly states no amendment can be made */}
      {confirmModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md max-h-[92vh] overflow-y-auto my-auto rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-4 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white text-center">
              {dict.confirmTitle}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
              {dict.confirmDesc} <strong>{confirmModalCandidate.name}</strong> ({confirmModalCandidate.classId})?
            </p>

            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-semibold mt-4 text-center">
              Peringatan: Undian adalah <strong>MUKTAMAD</strong>. Tiada sebarang pindaan dibenarkan setelah disahkan.
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmModalCandidate(null)}
                className="flex-1 py-3 px-4 min-h-[48px] rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-200 transition cursor-pointer active:scale-98"
              >
                {dict.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmVote}
                className="flex-1 py-3 px-4 min-h-[48px] rounded-xl bg-[#EAB308] hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>Sahkan Undian</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

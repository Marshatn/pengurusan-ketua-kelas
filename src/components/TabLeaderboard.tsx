import React, { useState } from 'react';
import { Award, BarChart3, Sparkles, TrendingUp, AlignLeft, BarChart2, Layers, Medal, Trophy, Printer } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from 'recharts';
import { VoteRecord, ClassLeaderData, VoteCategory, UserSession } from '../types';
import { TeacherVoterList } from './TeacherVoterList';
import { t } from '../translations';

interface TabLeaderboardProps {
  votes: VoteRecord[];
  classesData: ClassLeaderData[];
  selectedYear: number;
  lang: 'ms' | 'zh';
  teachers: string[];
  user: UserSession;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TabLeaderboard: React.FC<TabLeaderboardProps> = ({ votes, classesData, selectedYear, lang, teachers, user, addToast }) => {
  const [activeCategory, setActiveCategory] = useState<VoteCategory>('ketua_tahap1');
  const [filterMode, setFilterMode] = useState<'all' | 'top'>('all');
  const [chartOrientation, setChartOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [sortBy, setSortBy] = useState<'votes' | 'class'>('votes');

  const dict = t[lang].leaderboardTab;
  const vdict = t[lang].votingTab;

  const CATEGORIES: { id: VoteCategory; label: string; scope: string; isKetua: boolean; isTahap1: boolean }[] = [
    {
      id: 'ketua_tahap1',
      label: vdict.ketuaTahap1,
      scope: vdict.scopeTahap1,
      isKetua: true,
      isTahap1: true,
    },
    {
      id: 'ketua_tahap2',
      label: vdict.ketuaTahap2,
      scope: vdict.scopeTahap2,
      isKetua: true,
      isTahap1: false,
    },
    {
      id: 'penolong_tahap1',
      label: vdict.penolongTahap1,
      scope: vdict.scopeTahap1,
      isKetua: false,
      isTahap1: true,
    },
    {
      id: 'penolong_tahap2',
      label: vdict.penolongTahap2,
      scope: vdict.scopeTahap2,
      isKetua: false,
      isTahap1: false,
    },
  ];

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  const yearVotes = votes.filter((v) => v.year === selectedYear && v.category === activeCategory);
  const totalCategoryVotes = yearVotes.length;

  // Filter eligible classes (Tahap 1 = Grades 1-3, Tahap 2 = Grade 6)
  const eligibleClasses = classesData.filter((cls) => {
    if (currentCategoryObj.isTahap1) {
      return cls.grade >= 1 && cls.grade <= 3;
    } else {
      return cls.grade === 6;
    }
  });

  const candidateCounts: { [name: string]: { name: string; count: number; classId: string; grade: number } } = {};

  eligibleClasses.forEach((cls) => {
    const name = currentCategoryObj.isKetua ? cls.headPrefect : cls.assistantPrefect;
    if (name && name.trim() !== '') {
      candidateCounts[name] = { name, count: 0, classId: cls.id, grade: cls.grade };
    }
  });

  yearVotes.forEach((v) => {
    if (candidateCounts[v.candidateName]) {
      candidateCounts[v.candidateName].count += 1;
    } else {
      candidateCounts[v.candidateName] = { name: v.candidateName, count: 1, classId: v.classId, grade: 1 };
    }
  });

  // Calculate overall ranks
  const rankedAll = Object.values(candidateCounts).sort((a, b) => b.count - a.count || a.classId.localeCompare(b.classId));
  const rankMap = new Map<string, number>();
  rankedAll.forEach((cand, idx) => {
    rankMap.set(cand.name, idx + 1);
  });

  // Prepare chart dataset
  let chartList = Object.values(candidateCounts).map((cand) => {
    const rank = rankMap.get(cand.name) || 99;
    const percentage = totalCategoryVotes > 0 ? Number(((cand.count / totalCategoryVotes) * 100).toFixed(1)) : 0;
    return {
      name: cand.name,
      classId: cand.classId,
      label: `${cand.classId} · ${cand.name}`,
      fullLabel: `${cand.classId} · ${cand.name}`,
      count: cand.count,
      rank,
      percentage,
      grade: cand.grade,
    };
  });

  if (sortBy === 'votes') {
    chartList.sort((a, b) => b.count - a.count || a.classId.localeCompare(b.classId));
  } else {
    const getColorRank = (id: string): number => {
      const last = id.slice(-1).toUpperCase();
      if (last === 'M') return 1;
      if (last === 'K') return 2;
      if (last === 'B') return 3;
      return 4;
    };
    chartList.sort((a, b) => {
      const gA = a.grade || parseInt(a.classId, 10) || 0;
      const gB = b.grade || parseInt(b.classId, 10) || 0;
      if (gA !== gB) return gA - gB;
      const cA = getColorRank(a.classId);
      const cB = getColorRank(b.classId);
      if (cA !== cB) return cA - cB;
      return a.classId.localeCompare(b.classId);
    });
  }

  if (filterMode === 'top' && chartList.length > 8) {
    chartList = chartList.slice(0, 8);
  }

  const uniqueVoters = new Set(votes.filter((v) => v.year === selectedYear).map((v) => v.voterId)).size;
  const maxVotes = Math.max(...chartList.map((c) => c.count), 0);

  // Dynamic bar colors based on standing
  const getBarColor = (rank: number, count: number) => {
    if (count === 0) return '#94A3B8'; // Slate 400 for 0 votes
    if (rank === 1) return '#EAB308'; // Gold
    if (rank === 2) return '#38BDF8'; // Silver / Sky Blue
    if (rank === 3) return '#F97316'; // Bronze / Amber Orange
    return '#2563EB'; // Vibrant Royal Blue
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0F172A] text-white p-3.5 rounded-2xl shadow-2xl border border-amber-400/40 text-xs font-sans min-w-[210px] backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black font-mono text-[11px]">
              {data.classId}
            </span>
            <span className="font-extrabold text-sm text-slate-100 truncate">{data.name}</span>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{dict.chartVotesLabel}:</span>
              <span className="font-mono font-black text-amber-400 text-sm">{data.count} undi</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{dict.percentageLabel}:</span>
              <span className="font-mono text-slate-200 font-bold">{data.percentage}%</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/80 text-[11px]">
              <span className="text-amber-300/80">Kedudukan Semasa:</span>
              <span className="font-mono font-black text-white">#{data.rank}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const generatePrintableHtmlLeaderboard = () => {
    const rowsHtml = rankedAll
      .map(
        (c, idx) => `
        <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1;">${c.name}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1;">${c.classId}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-weight: bold;">${c.count}</td>
        </tr>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #000000; color: #ffffff; padding: 10px; text-align: left; }
    td { padding: 10px; border: 1px solid #cbd5e1; }
  </style>
</head>
<body>
  <h1>Keputusan Undian: ${currentCategoryObj.label}</h1>
  <table>
    <thead>
      <tr>
        <th>Kedudukan</th>
        <th>Nama Calon</th>
        <th>Kelas</th>
        <th>Jumlah Undi</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</body>
</html>`;
  };

  return (
    <div className="space-y-3 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="bg-[#0F172A] p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-6 text-white">
        <div>
          <span className="px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-400 text-slate-950 mb-2 inline-block">
            {dict.badge}
          </span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white">
            {dict.title} ({selectedYear})
          </h2>
          <p className="text-[11px] sm:text-xs text-amber-200/80 mt-1">
            {dict.desc}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0 flex-wrap">
          {user.role === 'admin' && (
            <button
              onClick={() => {
                const win = window.open('', '_blank');
                if (win) {
                  win.document.write(generatePrintableHtmlLeaderboard());
                  win.document.close();
                  setTimeout(() => {
                    win.print();
                    win.close();
                  }, 500);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-3 bg-[#EAB308] hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition whitespace-nowrap shrink-0 border border-amber-300 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Cetak Laporan</span>
            </button>
          )}
          
          <div className="bg-slate-800/80 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-400/30 text-center">
            <p className="text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase">{dict.totalVotes}</p>
            <p className="text-lg sm:text-2xl font-extrabold text-amber-400 font-mono mt-0.5">{totalCategoryVotes}</p>
          </div>
          <div className="bg-slate-800/80 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-400/30 text-center">
            <p className="text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase">{dict.activeVoters}</p>
            <p className="text-lg sm:text-2xl font-extrabold text-amber-400 font-mono mt-0.5">{uniqueVoters}</p>
          </div>
        </div>
      </div>

      {/* 4 Category Selection Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
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
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-2 ${
                    isActive
                      ? 'bg-[#0F172A] text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat.isTahap1 ? 'TAHAP I' : 'TAHAP II (Tahun 6)'}
                </span>
                <h4 className="text-xs font-black leading-tight">{cat.label}</h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium Showcase with Golden Yellow / Deep Navy without letter initials */}
      {rankedAll.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* 2nd Place (Silver) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center relative order-2 md:order-1 flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-bold flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-slate-900">
              🥈 2
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Medal className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{rankedAll[1]?.name || '-'}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kelas: {rankedAll[1]?.classId || '-'}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xl font-extrabold font-mono text-slate-700 dark:text-slate-300">
                {rankedAll[1]?.count || 0} Undian
              </span>
            </div>
          </div>

          {/* 1st Place (Gold Podium with Golden Yellow) */}
          <div className="bg-gradient-to-b from-amber-500/20 via-transparent to-transparent rounded-3xl border-2 border-amber-400 p-6 shadow-xl text-center relative order-1 md:order-2 flex flex-col justify-between transform md:-translate-y-4">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#EAB308] text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-lg border-2 border-white dark:border-slate-900">
              🥇 1
            </div>
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#EAB308] text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-amber-300">
                <Trophy className="w-8 h-8 text-slate-950" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{rankedAll[0]?.name || '-'}</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                Juara {currentCategoryObj.label} ({rankedAll[0]?.classId || '-'})
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/40">
              <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {rankedAll[0]?.count || 0} Undian
              </span>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center relative order-3 md:order-3 flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-slate-900">
              🥉 3
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Medal className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{rankedAll[2]?.name || '-'}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kelas: {rankedAll[2]?.classId || '-'}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xl font-extrabold font-mono text-slate-700 dark:text-slate-300">
                {rankedAll[2]?.count || 0} Undian
              </span>
            </div>
          </div>
        </div>
      )}

      {/* RECHARTS BAR CHART VISUALIZATION SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>{dict.chartTitle}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#EAB308]" />
              <span>{currentCategoryObj.label}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {dict.chartDesc}
            </p>
          </div>

          {/* Interactive Chart Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Filter: All vs Top 8 */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterMode === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {dict.chartFilterAll}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('top')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterMode === 'top'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {dict.chartFilterTop}
              </button>
            </div>

            {/* Sort: By Votes vs By Class ID */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSortBy('votes')}
                className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  sortBy === 'votes'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Susun mengikut undian terbanyak"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Undi</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('class')}
                className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  sortBy === 'class'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Susun mengikut urutan kelas (1M - 6B)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kelas</span>
              </button>
            </div>

            {/* Orientation: Horizontal vs Vertical */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setChartOrientation('horizontal')}
                className={`p-1.5 rounded-lg transition ${
                  chartOrientation === 'horizontal'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Paparan Bar Mendatar (Mudah Baca Nama)"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setChartOrientation('vertical')}
                className={`p-1.5 rounded-lg transition ${
                  chartOrientation === 'vertical'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Paparan Bar Menegak"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend & Summary Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-[#EAB308]" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">#1 Emas (Gold)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-[#38BDF8]" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">#2 Perak (Silver)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-[#F97316]" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">#3 Gangsa (Bronze)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-[#2563EB]" />
              <span>Calon Lain</span>
            </span>
          </div>

          <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">
            Skala Maksimum: <strong className="text-slate-800 dark:text-slate-200">{maxVotes}</strong> undian
          </div>
        </div>

        {/* The Responsive Recharts Bar Chart */}
        <div className="w-full mt-2">
          {chartOrientation === 'horizontal' ? (
            /* Horizontal Bar Chart (Best readability for names) */
            <div
              style={{
                height: `${Math.max(380, chartList.length * 34 + 60)}px`,
                width: '100%',
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartList}
                  margin={{ top: 10, right: 35, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={{ stroke: '#CBD5E1' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(234, 179, 8, 0.08)' }} />
                  <Bar
                    dataKey="count"
                    radius={[0, 8, 8, 0]}
                    barSize={18}
                    animationDuration={800}
                  >
                    {chartList.map((entry) => (
                      <Cell
                        key={`cell-${entry.classId}-${entry.name}`}
                        fill={getBarColor(entry.rank, entry.count)}
                      />
                    ))}
                    <LabelList
                      dataKey="count"
                      position="right"
                      formatter={(val: any) => `${val}`}
                      style={{
                        fill: '#1E293B',
                        fontSize: '11px',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            /* Vertical Bar Chart */
            <div style={{ height: '420px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="horizontal"
                  data={chartList}
                  margin={{ top: 20, right: 15, left: -10, bottom: 65 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    dataKey="classId"
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={{ stroke: '#CBD5E1' }}
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={{ stroke: '#CBD5E1' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(234, 179, 8, 0.08)' }} />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    barSize={filterMode === 'top' ? 28 : 18}
                    animationDuration={800}
                  >
                    {chartList.map((entry) => (
                      <Cell
                        key={`vcell-${entry.classId}-${entry.name}`}
                        fill={getBarColor(entry.rank, entry.count)}
                      />
                    ))}
                    <LabelList
                      dataKey="count"
                      position="top"
                      formatter={(val: any) => `${val}`}
                      style={{
                        fill: '#1E293B',
                        fontSize: '11px',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <span>{dict.fullList}</span>
        </h3>

        <div className="space-y-4">
          {rankedAll.map((cand, idx) => {
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

      {/* Teachers Who Have Voted (Confidential - Student selection hidden) */}
      <TeacherVoterList
        votes={votes}
        teachers={teachers}
        selectedYear={selectedYear}
        lang={lang}
      />
    </div>
  );
};


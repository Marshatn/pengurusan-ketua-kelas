import React, { useState, useMemo } from 'react';
import { CheckCircle2, Clock, ShieldCheck, UserCheck, Search, Filter, Lock, Users } from 'lucide-react';
import { VoteRecord, TeacherRecord } from '../types';
import { INITIAL_TEACHER_RECORDS } from '../data/initialData';

interface TeacherVoterListProps {
  votes: VoteRecord[];
  teachers: (TeacherRecord | string)[];
  selectedYear: number;
  lang: 'ms' | 'zh';
}

export const TeacherVoterList: React.FC<TeacherVoterListProps> = ({
  votes,
  teachers,
  selectedYear,
  lang,
}) => {
  const [filter, setFilter] = useState<'all' | 'voted' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize teachers into objects with name and IC
  const normalizedTeachers = useMemo<TeacherRecord[]>(() => {
    return teachers.map((th, idx) => {
      if (typeof th === 'string') {
        const found = INITIAL_TEACHER_RECORDS.find((r) => r.name.trim().toUpperCase() === th.trim().toUpperCase());
        return found || { name: th, ic: `85010112${String(idx + 1).padStart(4, '0')}` };
      }
      return th;
    });
  }, [teachers]);

  // Votes in the selected academic year
  const yearVotes = useMemo(() => {
    return votes.filter((v) => v.year === selectedYear);
  }, [votes, selectedYear]);

  // Aggregate teacher voting records
  const teacherStatusList = useMemo(() => {
    return normalizedTeachers.map((teacher) => {
      const teacherName = teacher.name;
      const tName = teacherName.trim().replace(/\s+/g, ' ').toUpperCase();
      const tIc = (teacher.ic || '').replace(/[-\s]/g, '').toUpperCase();

      // Find all votes matching this teacher flexibly (exact IC, exact name, or case-insensitive contains)
      const matchingVotes = yearVotes.filter((v) => {
        const vName = (v.voterName || '').trim().replace(/\s+/g, ' ').toUpperCase();
        const vId = (v.voterId || '').trim().replace(/[-\s]/g, '').toUpperCase();

        const matchIc = tIc && (vId === tIc || vName === tIc);
        const matchName = vName === tName || vId === tName || vName.includes(tName) || tName.includes(vName) || vId.includes(tName);

        return matchIc || matchName;
      });

      const uniqueCategories = new Set(matchingVotes.map((v) => v.category));
      const hasVoted = matchingVotes.length > 0;
      const categoriesVoted = uniqueCategories.size;

      // Find latest timestamp if voted
      let latestTimestamp: string | null = null;
      if (matchingVotes.length > 0) {
        const sorted = [...matchingVotes].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        latestTimestamp = sorted[0].timestamp;
      }

      return {
        name: teacherName,
        hasVoted,
        categoriesVoted,
        totalVotesCast: matchingVotes.length,
        latestTimestamp,
      };
    });
  }, [normalizedTeachers, yearVotes]);

  // Summary counts
  const totalTeachers = normalizedTeachers.length;
  const votedTeachersCount = teacherStatusList.filter((t) => t.hasVoted).length;
  const pendingTeachersCount = totalTeachers - votedTeachersCount;
  const turnoutPercent = totalTeachers > 0 ? ((votedTeachersCount / totalTeachers) * 100).toFixed(1) : '0';

  // Filtered list based on tab & search query
  const filteredTeachers = useMemo(() => {
    return teacherStatusList
      .filter((item) => {
        if (filter === 'voted') return item.hasVoted;
        if (filter === 'pending') return !item.hasVoted;
        return true;
      })
      .filter((item) => {
        if (!searchQuery.trim()) return true;
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // Purely alphabetical sorting
        return a.name.localeCompare(b.name);
      });
  }, [teacherStatusList, filter, searchQuery]);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(lang === 'ms' ? 'ms-MY' : 'zh-CN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-slate-900/90 dark:bg-slate-900/90 rounded-3xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
      {/* Subtle Neon Decorative Header Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Confidentiality Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              {lang === 'ms' ? 'Status Kehadiran Mengundi' : '教师投票出席名单'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              {lang === 'ms' ? 'Undian Rahsia (Pilihan Murid Dirahsiakan)' : '无记名保密投票'}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {lang === 'ms'
              ? `Senarai Guru Yang Telah Mengundi (Sesi ${selectedYear})`
              : `已完成投票教师名单（${selectedYear}学年）`}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {lang === 'ms'
              ? 'Status rekod guru yang telah menunaikan tanggungjawab mengundi. Mengikut dasar kerahsiaan undian, nama murid yang dipilih adalah sulit dan tidak dipaparkan.'
              : '记录已履行投票职责的教师名单。根据投票保密原则，所投学生姓名完全保密并不予显示。'}
          </p>
        </div>

        {/* Turnout Progress Card */}
        <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 shrink-0 w-full md:w-64">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 font-medium">
              {lang === 'ms' ? 'Peratus Keluar Mengundi:' : '投票出席率：'}
            </span>
            <span className="font-extrabold text-cyan-300 text-sm">{turnoutPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${Math.min(100, Number(turnoutPercent))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>
              {lang === 'ms' ? 'Telah Mengundi:' : '已投票：'}{' '}
              <strong className="text-emerald-400">{votedTeachersCount}</strong> / {totalTeachers}
            </span>
            <span>
              {lang === 'ms' ? 'Belum:' : '未投：'}{' '}
              <strong className="text-amber-400">{pendingTeachersCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'ms' ? 'Semua Guru' : '全部教师'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-slate-900/60 text-[10px]">
              {totalTeachers}
            </span>
          </button>

          <button
            onClick={() => setFilter('voted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'voted'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'ms' ? 'Telah Mengundi' : '已投票'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-950/80 text-emerald-200 text-[10px]">
              {votedTeachersCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'ms' ? 'Belum Mengundi' : '未投票'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-amber-950/80 text-amber-200 text-[10px]">
              {pendingTeachersCount}
            </span>
          </button>
        </div>

        {/* Search Teacher Input */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ms' ? 'Cari nama guru...' : '搜索教师姓名...'}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>
      </div>

      {/* Mobile Card View (Easy to view and effective on smartphones) */}
      <div className="sm:hidden space-y-3">
        {filteredTeachers.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            {lang === 'ms' ? 'Tiada rekod guru ditemui.' : '未找到符合条件的教师记录。'}
          </div>
        ) : (
          filteredTeachers.map((teacher, index) => (
            <div
              key={teacher.name}
              className={`p-3.5 rounded-2xl border ${
                teacher.hasVoted
                  ? 'bg-slate-900/80 border-cyan-500/30'
                  : 'bg-slate-950/70 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <h4 className="text-xs font-bold text-white">{teacher.name}</h4>
                </div>

                {teacher.hasVoted ? (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${teacher.categoriesVoted === 4 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${teacher.categoriesVoted === 4 ? 'text-emerald-400' : 'text-cyan-400'}`} />
                    <span>{teacher.categoriesVoted === 4 ? (lang === 'ms' ? 'Selesai Mengundi' : '已完成投票') : (lang === 'ms' ? 'Telah Mengundi' : '已投票')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                    <Clock className="w-3 h-3 text-rose-400" />
                    <span>{lang === 'ms' ? 'Belum Selesai' : '未完成'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <div>
                  {teacher.hasVoted ? (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                      {teacher.categoriesVoted} / 4 {lang === 'ms' ? 'Kategori' : '类别'}
                    </span>
                  ) : (
                    <span className="text-slate-500">Menunggu undian</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {teacher.hasVoted && (
                    <span className="font-mono text-[10px] text-slate-400">
                      {formatDate(teacher.latestTimestamp)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    <span>Dirahsiakan</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Teachers Table (Hidden on Mobile) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0F172A] text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">{lang === 'ms' ? 'Nama Guru' : '教师姓名'}</th>
              <th className="py-3 px-4 text-center">{lang === 'ms' ? 'Status Undian' : '投票状态'}</th>
              <th className="py-3 px-4 text-center">{lang === 'ms' ? 'Kategori Diundi' : '已投类别'}</th>
              <th className="py-3 px-4">{lang === 'ms' ? 'Masa Undian Terkini' : '最新投票时间'}</th>
              <th className="py-3 px-4 text-center">{lang === 'ms' ? 'Pilihan Murid' : '投票选择'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  {lang === 'ms' ? 'Tiada rekod guru ditemui.' : '未找到符合条件的教师记录。'}
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <tr
                  key={teacher.name}
                  className={`transition hover:bg-slate-800/50 ${
                    teacher.hasVoted ? 'bg-slate-900/40' : 'opacity-85'
                  }`}
                >
                  <td className="py-3 px-4 text-center font-mono text-slate-500 text-[11px]">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span>{teacher.name}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {teacher.hasVoted ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${teacher.categoriesVoted === 4 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'}`}>
                        <CheckCircle2 className={`w-3 h-3 ${teacher.categoriesVoted === 4 ? 'text-emerald-400' : 'text-cyan-400'}`} />
                        <span>{teacher.categoriesVoted === 4 ? (lang === 'ms' ? 'Selesai Mengundi' : '已完成投票') : (lang === 'ms' ? 'Telah Mengundi' : '已投票')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <Clock className="w-3 h-3 text-rose-400" />
                        <span>{lang === 'ms' ? 'Belum Selesai' : '未完成'}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    {teacher.hasVoted ? (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] ${
                          teacher.categoriesVoted === 4
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {teacher.categoriesVoted} / 4 {lang === 'ms' ? 'Kategori' : '类别'}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                    {formatDate(teacher.latestTimestamp)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      title={
                        lang === 'ms'
                          ? 'Pilihan murid dirahsiakan sepenuhnya bagi mematuhi etika kerahsiaan undian.'
                          : '为遵守投票保密原则，学生姓名已隐藏。'
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold tracking-wide"
                    >
                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                      <span>{lang === 'ms' ? 'Dirahsiakan' : '已保密'}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Notice */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          {lang === 'ms'
            ? 'Pengesahan Integriti: Setiap guru mengundi menggunakan nombor Kad Pengenalan rasmi. Undian dikira secara automatik tanpa mendedahkan pilihan individu.'
            : '诚信保证：每位教师凭正式身份证号投票。票数自动汇总，且绝不公开个人选择。'}
        </span>
      </div>
    </div>
  );
};

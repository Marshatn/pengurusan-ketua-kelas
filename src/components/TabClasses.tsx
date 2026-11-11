import React, { useState } from 'react';
import { Search, Printer, CheckCircle, UserCheck, GraduationCap, School, Shield } from 'lucide-react';
import { ClassLeaderData, UserSession } from '../types';
import { t } from '../translations';

interface TabClassesProps {
  classesData: ClassLeaderData[];
  onUpdateClass: (updated: ClassLeaderData) => void;
  selectedYear: number;
  user: UserSession;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: 'ms' | 'zh';
  teachers: string[];
}

export const TabClasses: React.FC<TabClassesProps> = ({
  classesData,
  onUpdateClass,
  selectedYear,
  user,
  addToast,
  lang,
  teachers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedStatusId, setSavedStatusId] = useState<string | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const dict = t[lang].classesTab;

  const handleFieldChange = (
    classId: string,
    field: 'teacherName' | 'headPrefect' | 'assistantPrefect',
    value: string
  ) => {
    const target = classesData.find((c) => c.id === classId);
    if (!target) return;

    const updated: ClassLeaderData = {
      ...target,
      [field]: value,
    };
    onUpdateClass(updated);

    setSavedStatusId(classId);
    setTimeout(() => {
      setSavedStatusId(null);
    }, 2000);
  };

  const filteredClasses = classesData.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.headPrefect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assistantPrefect.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-3xl border border-amber-400/35 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-white">
        <div>
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-400 text-slate-950 mb-3 inline-block">
            SK / SJKC Malaysia (1M - 6B)
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <School className="w-6 h-6 text-amber-400" />
            <span>{dict.title} {selectedYear}</span>
          </h2>
          <p className="text-xs text-amber-200/80 mt-1 max-w-2xl">
            {dict.desc}
          </p>
        </div>

        <button
          onClick={() => setPrintModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#EAB308] hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition whitespace-nowrap shrink-0 border border-amber-300"
        >
          <Printer className="w-4 h-4" />
          <span>{dict.printBtn}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
          Jumlah Kelas: <span className="text-amber-500 font-mono font-extrabold">{classesData.length} Kelas (1M hingga 6B)</span>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Class Cards Grid (1M to 6B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => {
          const isRecentlySaved = savedStatusId === cls.id;
          return (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg bg-amber-400 text-slate-950 shadow-xs">
                    Kelas {cls.id}
                  </span>
                  {isRecentlySaved ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                      <CheckCircle className="w-3.5 h-3.5" /> {dict.saved}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">Tahun {cls.grade}</span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
                  {cls.name}
                </h3>

                {/* Teacher Selection Dropdown */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> {dict.teacher}
                  </label>
                  <select
                    disabled={user.role === 'student'}
                    value={cls.teacherName}
                    onChange={(e) => handleFieldChange(cls.id, 'teacherName', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-80"
                  >
                    <option value="">-- Pilih Guru Kelas --</option>
                    {teachers.map((th) => (
                      <option key={th} value={th}>
                        {th}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {/* Ketua Kelas */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-500" /> {dict.headPrefect}
                    </label>
                    <input
                      type="text"
                      disabled={user.role === 'student'}
                      value={cls.headPrefect}
                      onChange={(e) => handleFieldChange(cls.id, 'headPrefect', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-80"
                      placeholder="Nama Ketua Kelas"
                    />
                  </div>

                  {/* Penolong */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" /> {dict.assistantPrefect}
                    </label>
                    <input
                      type="text"
                      disabled={user.role === 'student'}
                      value={cls.assistantPrefect}
                      onChange={(e) => handleFieldChange(cls.id, 'assistantPrefect', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-80"
                      placeholder="Nama Penolong Ketua Kelas"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Print Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Laporan Rasmi Senarai Pemimpin Murid</h3>
                <p className="text-xs text-slate-500">Sesi Akademik {selectedYear} · Kelas 1M hingga 6B</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#EAB308] text-slate-950 font-extrabold rounded-xl text-xs hover:bg-amber-500 transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <th className="p-3 border border-slate-200 dark:border-slate-700">Kelas</th>
                    <th className="p-3 border border-slate-200 dark:border-slate-700">Nama Kelas</th>
                    <th className="p-3 border border-slate-200 dark:border-slate-700">Guru Kelas</th>
                    <th className="p-3 border border-slate-200 dark:border-slate-700">Ketua Kelas</th>
                    <th className="p-3 border border-slate-200 dark:border-slate-700">Penolong Ketua Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  {classesData.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 border border-slate-200 dark:border-slate-700 font-extrabold text-amber-600">{c.id}</td>
                      <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold">{c.name}</td>
                      <td className="p-3 border border-slate-200 dark:border-slate-700">{c.teacherName}</td>
                      <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-blue-700 dark:text-blue-400">{c.headPrefect}</td>
                      <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-indigo-700 dark:text-indigo-400">{c.assistantPrefect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

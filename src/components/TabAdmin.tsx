import React, { useState } from 'react';
import { Settings, Lock, Unlock, RefreshCw, Database, Download, Megaphone, ShieldCheck, UserPlus, Trash2, Users } from 'lucide-react';
import { SystemSettings, UserSession } from '../types';
import { t } from '../translations';

interface TabAdminProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  onResetData: () => void;
  selectedYear: number;
  user: UserSession;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: 'ms' | 'zh';
  teachers: string[];
  onAddTeacher: (name: string) => void;
  onRemoveTeacher: (name: string) => void;
}

export const TabAdmin: React.FC<TabAdminProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  selectedYear,
  user,
  addToast,
  lang,
  teachers,
  onAddTeacher,
  onRemoveTeacher,
}) => {
  const [announcementText, setAnnouncementText] = useState(settings.announcement);
  const [newTeacherName, setNewTeacherName] = useState('');

  const dict = t[lang].adminTab;

  if (user.role !== 'admin') {
    return (
      <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-800 dark:text-rose-300">Akses Terhad Pentadbir</h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Anda perlu log masuk sebagai Admin / Guru Penasihat untuk mengakses panel tetapan ini.</p>
      </div>
    );
  }

  const handleToggleVoting = () => {
    const updated = { ...settings, votingOpen: !settings.votingOpen };
    onUpdateSettings(updated);
    addToast(updated.votingOpen ? 'Undian telah DIBUKA kepada pengundi.' : 'Undian telah DITUTUP.', updated.votingOpen ? 'success' : 'info');
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...settings, announcement: announcementText };
    onUpdateSettings(updated);
    addToast('Pengumuman sekolah berjaya dikemaskini!', 'success');
  };

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;
    onAddTeacher(newTeacherName.trim().toUpperCase());
    setNewTeacherName('');
    addToast('Guru baharu berjaya ditambahkan ke senarai!', 'success');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sistem_pemimpin_murid_${selectedYear}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Fail sandaran JSON berjaya dieksport!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-3xl border border-amber-400/30 shadow-xl text-white">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>{dict.title} (Sesi {selectedYear})</span>
        </h2>
        <p className="text-xs text-amber-200/80 mt-1">
          {dict.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voting Toggle Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                {settings.votingOpen ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                settings.votingOpen ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200' : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
              }`}>
                {settings.votingOpen ? 'Status: Dibuka' : 'Status: Ditutup'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dict.votingControl}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {dict.votingDesc}
            </p>
          </div>

          <button
            onClick={handleToggleVoting}
            className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 ${
              settings.votingOpen ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#EAB308] hover:bg-amber-500 text-slate-950'
            }`}
          >
            {settings.votingOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{settings.votingOpen ? dict.closeVotingBtn : dict.openVotingBtn}</span>
          </button>
        </div>

        {/* Announcement Broadcast */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-4">
              <Megaphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dict.announcementTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {dict.announcementDesc}
            </p>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                placeholder="Masukkan mesej pengumuman..."
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#EAB308] hover:bg-amber-500 text-slate-950 font-extrabold text-xs transition shadow-sm"
              >
                {dict.updateAnnouncement}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Teacher Master List Manager */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <span>Pengurusan Senarai Guru Sekolah ({teachers.length} Guru)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tambah guru baharu atau buang guru daripada senarai master.</p>
          </div>

          <form onSubmit={handleAddTeacherSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              required
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
              placeholder="Nama Penuh Guru Baharu..."
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none flex-1 sm:w-72"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#EAB308] hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Guru</span>
            </button>
          </form>
        </div>

        {/* Teachers List Table / Badges */}
        <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50 space-y-2">
          {teachers.map((th) => (
            <div key={th} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">{th}</span>
              <button
                onClick={() => {
                  if (window.confirm(`Adakah anda pasti mahu memadam ${th}?`)) {
                    onRemoveTeacher(th);
                    addToast(`Guru ${th} telah dipadam.`, 'info');
                  }
                }}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition"
                title="Padam Guru"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-500" />
          <span>{dict.dataBackup}</span>
        </h3>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-amber-300 font-extrabold text-xs rounded-xl shadow-md transition border border-amber-400/30"
          >
            <Download className="w-4 h-4" />
            <span>{dict.exportJson}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Adakah anda pasti mahu menetapkan semula semua data kepada asal?')) {
                onResetData();
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-extrabold text-xs rounded-xl transition border border-rose-200 dark:border-rose-900"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{dict.resetData}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

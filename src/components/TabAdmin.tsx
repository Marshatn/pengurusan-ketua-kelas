import React, { useState } from 'react';
import { Settings, Lock, Unlock, RefreshCw, Database, Download, Megaphone, ShieldCheck, UserPlus, Trash2, Users, Search, AlertTriangle, KeyRound } from 'lucide-react';
import { SystemSettings, UserSession, TeacherRecord } from '../types';
import { t } from '../translations';

interface TabAdminProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  onResetData: () => void;
  selectedYear: number;
  user: UserSession;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: 'ms' | 'zh';
  teachers: TeacherRecord[];
  onAddTeacher: (name: string, ic: string) => void;
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
  const [newTeacherIc, setNewTeacherIc] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherRecord | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const dict = t[lang].adminTab;

  if (user.role !== 'admin') {
    return (
      <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-800">Akses Terhad Pentadbir</h3>
        <p className="text-xs text-rose-600 mt-1">Anda perlu log masuk sebagai Admin / Guru Penasihat untuk mengakses panel tetapan ini.</p>
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
    const cleanName = newTeacherName.trim().toUpperCase();
    const cleanIc = newTeacherIc.trim().replace(/[-\s]/g, '');

    if (!cleanName) {
      addToast('Sila masukkan nama penuh guru.', 'error');
      return;
    }

    if (!cleanIc || !/^\d{10,12}$/.test(cleanIc)) {
      addToast('Nombor Kad Pengenalan (IC) mestilah 10 hingga 12 digit nombor tanpa tanda "-".', 'error');
      return;
    }

    if (teachers.some(t => t.name.toUpperCase() === cleanName)) {
      addToast('Guru dengan nama ini sudah wujud dalam senarai.', 'error');
      return;
    }

    if (teachers.some(t => t.ic === cleanIc)) {
      addToast('Nombor IC ini sudah didaftarkan kepada guru lain.', 'error');
      return;
    }

    onAddTeacher(cleanName, cleanIc);
    setNewTeacherName('');
    setNewTeacherIc('');
    addToast(`Guru ${cleanName} (IC: ${cleanIc}) berjaya didaftarkan!`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!teacherToDelete) return;
    const name = teacherToDelete.name;
    onRemoveTeacher(name);
    addToast(`Guru ${name} telah berjaya dipadam daripada senarai.`, 'info');
    setTeacherToDelete(null);
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

  const filteredTeachers = teachers.filter((t) => {
    if (!teacherSearch.trim()) return true;
    const q = teacherSearch.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.ic.includes(q);
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-3xl border border-amber-400/30 shadow-xl text-white">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>{dict.title} (Sesi {selectedYear})</span>
        </h2>
        <p className="text-xs text-amber-200/80 mt-1">
          {dict.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voting Toggle Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                {settings.votingOpen ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                settings.votingOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {settings.votingOpen ? 'Status: Dibuka' : 'Status: Ditutup'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{dict.votingControl}</h3>
            <p className="text-xs text-slate-500 mb-6">
              {dict.votingDesc}
            </p>
          </div>

          <button
            onClick={handleToggleVoting}
            className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
              settings.votingOpen ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#EAB308] hover:bg-amber-500 text-slate-950'
            }`}
          >
            {settings.votingOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{settings.votingOpen ? dict.closeVotingBtn : dict.openVotingBtn}</span>
          </button>
        </div>

        {/* Announcement Broadcast */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Megaphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{dict.announcementTitle}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {dict.announcementDesc}
            </p>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                placeholder="Masukkan mesej pengumuman..."
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#EAB308] hover:bg-amber-500 text-slate-950 font-extrabold text-xs transition shadow-sm cursor-pointer"
              >
                {dict.updateAnnouncement}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Teacher Master List Manager with Name and IC support */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <span>Pengurusan Senarai Guru Sekolah ({teachers.length} Guru)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tambah guru baharu berserta nombor Kad Pengenalan (IC) untuk sistem pengecaman auto semasa log masuk.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              placeholder="Cari guru atau IC..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Add Teacher Form with Both Name AND IC */}
        <form onSubmit={handleAddTeacherSubmit} className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 mb-6">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-amber-600" />
            <span>Daftar Guru Baharu</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Penuh Guru</label>
              <input
                type="text"
                required
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                placeholder="cth: ANSON TONG CHENG XUN"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none uppercase"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombor IC (Kad Pengenalan)</label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={newTeacherIc}
                  onChange={(e) => setNewTeacherIc(e.target.value)}
                  placeholder="cth: 880215125544 (tanpa '-')"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#EAB308] hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Simpan Guru</span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-amber-700/80 mt-2">
            * Nombor IC akan digunakan secara automatik oleh guru untuk log masuk ke sistem.
          </p>
        </form>

        {/* Teachers List Table / Items */}
        <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-200 p-3 bg-slate-50 space-y-2">
          {filteredTeachers.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">Tiada guru ditemui.</p>
          ) : (
            filteredTeachers.map((th, index) => (
              <div
                key={th.name}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">{th.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded font-semibold">
                        IC: {th.ic}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTeacherToDelete(th)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Padam Guru"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Padam</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* In-App Delete Confirmation Modal (Guaranteed to work in iframe without window.confirm) */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900">
              Sahkan Padam Guru?
            </h3>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Adakah anda pasti mahu memadam <strong>{teacherToDelete.name}</strong> (IC: {teacherToDelete.ic}) daripada senarai guru sekolah?
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition cursor-pointer"
              >
                Ya, Padam Guru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Management & Backup */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-500" />
          <span>{dict.dataBackup}</span>
        </h3>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-amber-300 font-extrabold text-xs rounded-xl shadow-md transition border border-amber-400/30 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{dict.exportJson}</span>
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl transition border border-rose-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{dict.resetData}</span>
          </button>
        </div>
      </div>

      {/* Reset Data Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900">
              Tetapkan Semula Semua Data?
            </h3>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Tindakan ini akan mengembalikan semua maklumat kelas, undian, dan senarai guru kepada tetapan asal.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowResetConfirmModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition cursor-pointer"
              >
                Ya, Tetapkan Semula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

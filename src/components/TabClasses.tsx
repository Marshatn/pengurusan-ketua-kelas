import React, { useState } from 'react';
import { School, Edit3, Check, Search, Printer, Download, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';
import { ClassLeaderData, UserSession } from '../types';
import { t } from '../translations';

interface TabClassesProps {
  classesData: ClassLeaderData[];
  onUpdateClass: (cls: ClassLeaderData) => void;
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
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<ClassLeaderData | null>(null);
  const [savedStatusId, setSavedStatusId] = useState<string | null>(null);

  const dict = t[lang].classesTab;

  const handleStartEdit = (cls: ClassLeaderData) => {
    setEditingClassId(cls.id);
    setEditFormData({ ...cls });
  };

  const handleSaveEdit = (clsId: string) => {
    if (!editFormData) return;
    onUpdateClass(editFormData);
    setEditingClassId(null);
    setSavedStatusId(clsId);
    setTimeout(() => setSavedStatusId(null), 2500);
    addToast(lang === 'ms' ? `Maklumat ${editFormData.name} berjaya dikemaskini!` : `班级 ${editFormData.name} 信息已更新！`, 'success');
  };

  const filteredClasses = classesData.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.headPrefect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assistantPrefect.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Generate clean standalone printable HTML document
  const generatePrintableHtml = () => {
    const rowsHtml = classesData
      .map(
        (c, idx) => `
        <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #b45309;">${c.id}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a;">${c.name}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; color: #334155;">${c.teacherName.toUpperCase()}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-weight: 600; color: #1d4ed8;">${(c.headPrefect || '-').toUpperCase()}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-weight: 600; color: #4338ca;">${(c.assistantPrefect || '-').toUpperCase()}</td>
        </tr>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Senarai Rasmi Pemimpin Murid Sesi ${selectedYear} - SJK (C) Chung Hwa Kota Belud</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #fff; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px; }
    .school-title { font-size: 20px; font-weight: 900; letter-spacing: 0.5px; color: #0f172a; text-transform: uppercase; margin: 0; }
    .school-subtitle { font-size: 14px; font-weight: 700; color: #b45309; margin: 4px 0 0 0; }
    .doc-title { font-size: 15px; font-weight: 800; color: #1e3a8a; margin: 10px 0 0 0; text-transform: uppercase; }
    .session-info { font-size: 12px; color: #64748b; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11.5px; }
    th { background: #000000; color: #ffffff; padding: 10px 12px; border: 1px solid #000000; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .signatures { margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid; }
    .sign-box { width: 220px; text-align: center; font-size: 11px; color: #334155; }
    .sign-line { border-bottom: 1px solid #0f172a; height: 60px; margin-bottom: 8px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="school-title">SJK (C) CHUNG HWA KOTA BELUD</h1>
    <h2 class="school-subtitle">古打毛律中华学校 · PETI SURAT 14, 89157 KOTA BELUD, SABAH</h2>
    <div class="doc-title">SENARAI RASMI KETUA KELAS & PENOLONG KETUA KELAS (18 KELAS)</div>
    <div class="session-info">SESI AKADEMIK TAHUN ${selectedYear} · TARIKH CETAKAN: ${new Date().toLocaleDateString('ms-MY')}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px; text-align: center;">Kod</th>
        <th>Nama Kelas</th>
        <th>Guru Kelas</th>
        <th>Ketua Kelas</th>
        <th>Penolong Ketua Kelas</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sign-box">
      <div class="sign-line"></div>
      <strong>Disediakan Oleh:</strong><br>
      Guru Penasihat / Guru Disiplin<br>
      SJK (C) Chung Hwa Kota Belud
    </div>
    <div class="sign-box">
      <div class="sign-line"></div>
      <strong>Disahkan Oleh:</strong><br>
      Guru Besar / Penolong Kanan HEM<br>
      SJK (C) Chung Hwa Kota Belud
    </div>
  </div>
</body>
</html>`;
  };

  // Robust Print using a new window
  const handlePrintDocument = () => {
    const htmlContent = generatePrintableHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      // Wait briefly for content rendering
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      // Fallback
      window.print();
    }
  };

  // Download Standalone Printable HTML Report (Works 100% on all mobile devices and desktop)
  const handleDownloadReportHtml = () => {
    const htmlContent = generatePrintableHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Pemimpin_Murid_${selectedYear}_SJKC_ChungHwa.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Fail laporan rasmi berjaya dimuat turun! Anda boleh buka dan cetak atau simpan ke PDF.', 'success');
  };

  // Export CSV for Excel
  const handleDownloadCsv = () => {
    const headers = ['Bil', 'Kod Kelas', 'Nama Kelas', 'Guru Kelas', 'Ketua Kelas', 'Penolong Ketua Kelas'];
    const rows = classesData.map((c, idx) => [
      idx + 1,
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.teacherName}"`,
      `"${c.headPrefect}"`,
      `"${c.assistantPrefect}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Senarai_Pemimpin_Murid_${selectedYear}_SJKC_ChungHwa.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Fail CSV Excel berjaya dimuat turun!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Clean, badge and subtitle removed as requested) */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-3xl border border-amber-400/35 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden text-white">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5">
            <School className="w-6 h-6 text-amber-400 shrink-0" />
            <span>{dict.title} {selectedYear}</span>
          </h2>
        </div>

        {/* Action Button: Print / Export Document */}
        <button
          onClick={() => setPrintModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#EAB308] hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition whitespace-nowrap shrink-0 border border-amber-300 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{dict.printBtn}</span>
        </button>
      </div>

      {/* Search & Class Counter Bar (Optimized for Mobile) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
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
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
        </div>
      </div>

      {/* Class Cards Grid (1M to 6B) - High-efficiency mobile view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredClasses.map((cls) => {
          const isRecentlySaved = savedStatusId === cls.id;
          const isEditing = editingClassId === cls.id;

          return (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg shadow-xs ${
                    cls.name.toUpperCase().includes('MERAH') || cls.id.endsWith('M')
                      ? 'bg-red-500 text-white' 
                      : cls.name.toUpperCase().includes('BIRU') || cls.id.endsWith('B')
                      ? 'bg-blue-500 text-white'
                      : 'bg-amber-400 text-slate-950'
                  }`}>
                    Kelas {cls.id}
                  </span>
                  {isRecentlySaved ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                      <Check className="w-3.5 h-3.5" /> {dict.saved}
                    </span>
                  ) : (
                    (user.role === 'admin' || user.name === cls.teacherName) && (
                      <button
                        onClick={() => (isEditing ? handleSaveEdit(cls.id) : handleStartEdit(cls))}
                        className="text-xs font-semibold text-slate-500 hover:text-amber-500 flex items-center gap-1 p-1"
                        title={isEditing ? 'Simpan' : 'Kemaskini'}
                      >
                        {isEditing ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Simpan
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400 hover:text-white">
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-3">
                  {cls.name}
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Teacher */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {dict.teacher}
                    </span>
                    {isEditing ? (
                      <select
                        value={editFormData?.teacherName || ''}
                        onChange={(e) =>
                          setEditFormData((prev) => (prev ? { ...prev, teacherName: e.target.value } : null))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      >
                        {teachers.map((th) => (
                          <option key={th} value={th}>
                            {th}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="font-extrabold text-slate-800 dark:text-slate-100">{cls.teacherName.toUpperCase()}</p>
                    )}
                  </div>

                  {/* Head Prefect */}
                  <div className="bg-blue-50/70 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                      {dict.headPrefect}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData?.headPrefect || ''}
                        onChange={(e) =>
                          setEditFormData((prev) => (prev ? { ...prev, headPrefect: e.target.value } : null))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                        placeholder="Nama Ketua Kelas"
                      />
                    ) : (
                      <p className="font-black text-blue-900 dark:text-blue-200 text-sm">{(cls.headPrefect || '-').toUpperCase()}</p>
                    )}
                  </div>

                  {/* Assistant Prefect */}
                  <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                      {dict.assistantPrefect}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData?.assistantPrefect || ''}
                        onChange={(e) =>
                          setEditFormData((prev) => (prev ? { ...prev, assistantPrefect: e.target.value } : null))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                        placeholder="Nama Penolong Ketua Kelas"
                      />
                    ) : (
                      <p className="font-black text-indigo-900 dark:text-indigo-200 text-sm">
                        {(cls.assistantPrefect || '-').toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Print & Export Modal (Completely Solves Print Failure) */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-amber-400/30 shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0F172A] gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <Printer className="w-5 h-5 text-amber-400" />
                  <span>Laporan Rasmi Senarai Pemimpin Murid (18 Kelas)</span>
                </h3>
                <p className="text-xs text-amber-300 mt-1">
                  Sesi Akademik {selectedYear} · SJK (C) Chung Hwa Kota Belud
                </p>
              </div>

              <button
                onClick={() => setPrintModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions Bar (3 Fail-Safe Print & Export Methods) */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400 hidden sm:block">
                Pilih format cetakan atau muat turun dokumen laporan:
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Method 1: Direct Print */}
                <button
                  onClick={handlePrintDocument}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#EAB308] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Sekarang</span>
                </button>

                {/* Method 2: Download Standalone HTML/PDF Document */}
                <button
                  onClick={handleDownloadReportHtml}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                  title="Muat turun fail dokumen rasmi untuk dicetak atau disimpan ke PDF"
                >
                  <Download className="w-4 h-4" />
                  <span>Muat Turun PDF / Dokumen</span>
                </button>

                {/* Method 3: Download Excel CSV */}
                <button
                  onClick={handleDownloadCsv}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                  title="Eksport data ke Microsoft Excel"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel / CSV</span>
                </button>
              </div>
            </div>

            {/* Modal Document Preview Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-white text-slate-900">
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                <h4 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-950">
                  SJK (C) CHUNG HWA KOTA BELUD
                </h4>
                <p className="text-xs font-bold text-amber-700">
                  古打毛律中华学校 · PETI SURAT 14, 89157 KOTA BELUD, SABAH
                </p>
                <h5 className="text-sm font-extrabold text-blue-900 uppercase mt-2">
                  SENARAI RASMI KETUA KELAS & PENOLONG KETUA KELAS (18 KELAS)
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Sesi Akademik Tahun {selectedYear}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-bold text-[11px] uppercase tracking-wider">
                      <th className="p-2.5 border border-slate-900 text-center w-12">Kod</th>
                      <th className="p-2.5 border border-slate-900">Nama Kelas</th>
                      <th className="p-2.5 border border-slate-900">Guru Kelas</th>
                      <th className="p-2.5 border border-slate-900">Ketua Kelas</th>
                      <th className="p-2.5 border border-slate-900">Penolong Ketua Kelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {classesData.map((c, index) => (
                      <tr key={c.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-2.5 border border-slate-300 font-extrabold text-amber-600 text-center">
                          {c.id}
                        </td>
                        <td className="p-2.5 border border-slate-300 font-bold text-slate-900">{c.name}</td>
                        <td className="p-2.5 border border-slate-300 text-slate-700">{c.teacherName.toUpperCase()}</td>
                        <td className="p-2.5 border border-slate-300 font-semibold text-blue-700">
                          {(c.headPrefect || '-').toUpperCase()}
                        </td>
                        <td className="p-2.5 border border-slate-300 font-semibold text-indigo-700">
                          {(c.assistantPrefect || '-').toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="mt-12 flex justify-between text-xs pt-4 border-t border-slate-300">
                <div className="text-center w-48">
                  <div className="h-14 border-b border-slate-800" />
                  <p className="mt-2 font-bold text-slate-900">Disediakan Oleh:</p>
                  <p className="text-[11px] text-slate-600">Guru Penasihat / Disiplin</p>
                </div>
                <div className="text-center w-48">
                  <div className="h-14 border-b border-slate-800" />
                  <p className="mt-2 font-bold text-slate-900">Disahkan Oleh:</p>
                  <p className="text-[11px] text-slate-600">Guru Besar / PK HEM</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                Tutup Paparan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

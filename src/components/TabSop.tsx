import React, { useState } from 'react';
import { CheckSquare, Square, Printer, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { DailyChecklistTask } from '../types';
import { t } from '../translations';

interface TabSopProps {
  checklist: DailyChecklistTask[];
  onToggleChecklist: (id: string) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  lang: 'ms' | 'zh';
}

export const TabSop: React.FC<TabSopProps> = ({ checklist, onToggleChecklist, lang }) => {
  const [activeSession, setActiveSession] = useState<'pagi' | 'rehat' | 'balik'>('pagi');

  const dict = t[lang].sopTab;
  const filteredTasks = checklist.filter((t) => t.session === activeSession);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0F172A] p-6 sm:p-8 rounded-3xl border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-400 text-slate-950 mb-3 inline-block">
            {dict.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {dict.title}
          </h2>
          <p className="text-xs text-amber-200/80 mt-1 max-w-2xl">
            {dict.desc}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-3 bg-[#EAB308] hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition whitespace-nowrap shrink-0 border border-amber-300"
        >
          <Printer className="w-4 h-4" />
          <span>{dict.downloadBtn}</span>
        </button>
      </div>

      {/* Grid of Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ketua Kelas */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dict.ketuaTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ketua Kelas ialah tonggak kepimpinan akademik dan disiplin di peringkat bilik darjah.
            </p>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span><strong>Kawalan Disiplin:</strong> Menjaga ketenteraman kelas dan mengawal suasana senyap semasa ketiadaan guru.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span><strong>Doa & Ikrar:</strong> Memimpin bacaan doa pagi, ikrar rukun negara serta memberi salam hormat kepada guru.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span><strong>Keselamatan Rehat:</strong> Memastikan keselamatan murid di dalam kelas sewaktu waktu rehat.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Penolong */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dict.penolongTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Penolong Ketua Kelas menyokong penuh tugas ketua serta menguruskan infrastruktur fizikal kelas.
            </p>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span><strong>Pemangku Tugas:</strong> Mengambil alih tugas Ketua Kelas semasa ketiadaan Ketua Kelas.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span><strong>Kebersihan:</strong> Menyemak kebersihan fizikal kelas (papan putih dipadam, bakul sampah dikosongkan).</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span><strong>Penjimatan Tenaga:</strong> Memastikan suis lampu dan kipas dimatikan sewaktu keluar kelas atau waktu balik.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Daily Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-500" />
              <span>{dict.checklistTitle}</span>
            </h3>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveSession('pagi')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                activeSession === 'pagi' ? 'bg-[#0F172A] text-amber-300 shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {dict.sessionPagi}
            </button>
            <button
              onClick={() => setActiveSession('rehat')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                activeSession === 'rehat' ? 'bg-[#0F172A] text-amber-300 shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {dict.sessionRehat}
            </button>
            <button
              onClick={() => setActiveSession('balik')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                activeSession === 'balik' ? 'bg-[#0F172A] text-amber-300 shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {dict.sessionBalik}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleChecklist(task.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
                task.completed
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <button type="button" className="text-amber-500 focus:outline-none">
                  {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Square className="w-6 h-6 text-slate-400" />}
                </button>
                <div>
                  <span className={`text-xs font-semibold ${task.completed ? 'line-through opacity-80' : ''}`}>
                    {task.task}
                  </span>
                  <p className="text-[10px] uppercase font-mono text-slate-400 mt-0.5">
                    {task.category === 'ketua' ? 'Ketua Kelas' : 'Penolong Ketua Kelas'}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${
                task.completed ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {task.completed ? dict.completed : dict.pending}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

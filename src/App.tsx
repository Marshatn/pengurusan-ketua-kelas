import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { TabClasses } from './components/TabClasses';
import { TabVoting } from './components/TabVoting';
import { TabSop } from './components/TabSop';
import { TabLeaderboard } from './components/TabLeaderboard';
import { TabAdmin } from './components/TabAdmin';
import { ToastContainer, ToastMessage } from './components/Toast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { NeonBackground } from './components/NeonBackground';
import { INITIAL_CLASSES_2026, INITIAL_CHECKLIST, INITIAL_SETTINGS, TEACHER_LIST } from './data/initialData';
import { ClassLeaderData, VoteRecord, DailyChecklistTask, SystemSettings, UserSession } from './types';

export default function App() {
  const [lang, setLang] = useState<'ms' | 'zh'>('ms');

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_session');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { role: 'admin', username: 'admin', name: 'Admin / Guru Penasihat' };
  });

  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<string>('classes');

  // Teachers master list
  const [teachers, setTeachers] = useState<string[]>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_teachers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t: string) => !t.toUpperCase().includes('ERIC CHUNG'));
        }
      } catch { /* ignore */ }
    }
    return TEACHER_LIST.filter((t) => !t.toUpperCase().includes('ERIC CHUNG'));
  });

  const [classesByYear, setClassesByYear] = useState<{ [year: number]: ClassLeaderData[] }>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated: { [year: number]: ClassLeaderData[] } = {};
        for (const [yr, list] of Object.entries(parsed)) {
          migrated[Number(yr)] = (list as ClassLeaderData[]).map((c) => {
            let newName = c.name
              .replace(/Mawar/gi, 'Merah')
              .replace(/Kenanga/gi, 'Kuning')
              .replace(/Melati/gi, 'Biru');
            let teacherName = c.teacherName;
            if (teacherName.toUpperCase().includes('ERIC CHUNG')) {
              teacherName = 'BENNY BIN RAIJUN';
            }
            return {
              ...c,
              name: newName,
              teacherName,
            };
          });
        }
        return migrated;
      } catch { /* ignore */ }
    }
    return { 2026: INITIAL_CLASSES_2026 };
  });

  const [votes, setVotes] = useState<VoteRecord[]>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_votes');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [checklist, setChecklist] = useState<DailyChecklistTask[]>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_checklist');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_CHECKLIST;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_classes', JSON.stringify(classesByYear));
  }, [classesByYear]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sistem_pemimpin_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('sistem_pemimpin_session');
    }
  }, [user]);

  const currentClasses = classesByYear[selectedYear] || INITIAL_CLASSES_2026.map(c => ({ ...c }));

  const handleUpdateClass = (updated: ClassLeaderData) => {
    setClassesByYear((prev) => {
      const yearList = prev[selectedYear] || INITIAL_CLASSES_2026.map(c => ({ ...c }));
      const newList = yearList.map((item) => (item.id === updated.id ? updated : item));
      return { ...prev, [selectedYear]: newList };
    });
  };

  const handleAddTeacher = (name: string) => {
    if (teachers.includes(name)) return;
    setTeachers((prev) => [...prev, name].sort());
  };

  const handleRemoveTeacher = (name: string) => {
    setTeachers((prev) => prev.filter((th) => th !== name));
  };

  const handleCastVote = (vote: Omit<VoteRecord, 'id' | 'timestamp'>) => {
    const newRecord: VoteRecord = {
      ...vote,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    setVotes((prev) => [newRecord, ...prev]);
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    addToast('Status tugasan dikemaskini!', 'success');
  };

  const handleResetData = () => {
    setClassesByYear({ 2026: INITIAL_CLASSES_2026 });
    setTeachers(TEACHER_LIST.filter((t) => !t.toUpperCase().includes('ERIC CHUNG')));
    setVotes([]);
    setChecklist(INITIAL_CHECKLIST);
    setSettings(INITIAL_SETTINGS);
    addToast('Data sistem telah ditetapkan semula kepada asal.', 'info');
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-[#EAB308] selection:text-slate-950 pb-24 md:pb-16">
      {/* Slow Moving Automatic Neon Background for Main App Screen */}
      <NeonBackground variant="app" />

      <LoginModal isOpen={!user} onLogin={(sess) => setUser(sess)} lang={lang} setLang={setLang} teachers={teachers} />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <OfflineIndicator />

      {user && (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            user={user}
            onLogout={() => setUser(null)}
            lang={lang}
            setLang={setLang}
          />

          {settings.announcement && (
            <div className="bg-[#EAB308] text-slate-950 py-2.5 px-4 text-center text-xs font-extrabold shadow-inner flex items-center justify-center gap-2 border-b border-amber-500">
              <span className="px-2 py-0.5 rounded-md bg-[#0F172A] text-amber-300 uppercase text-[10px] tracking-wider font-mono">PENGUMUMAN / 公告</span>
              <span>{settings.announcement}</span>
            </div>
          )}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {activeTab === 'classes' && (
              <TabClasses
                classesData={currentClasses}
                onUpdateClass={handleUpdateClass}
                selectedYear={selectedYear}
                user={user}
                addToast={addToast}
                lang={lang}
                teachers={teachers}
              />
            )}

            {activeTab === 'voting' && (
              <TabVoting
                classesData={currentClasses}
                votes={votes}
                onCastVote={handleCastVote}
                selectedYear={selectedYear}
                user={user}
                settings={settings}
                addToast={addToast}
                lang={lang}
                teachers={teachers}
              />
            )}

            {activeTab === 'sop' && (
              <TabSop
                checklist={checklist}
                onToggleChecklist={handleToggleChecklist}
                addToast={addToast}
                lang={lang}
              />
            )}

            {activeTab === 'leaderboard' && (
              <TabLeaderboard
                votes={votes}
                classesData={currentClasses}
                selectedYear={selectedYear}
                lang={lang}
                teachers={teachers}
              />
            )}

            {activeTab === 'admin' && (
              <TabAdmin
                settings={settings}
                onUpdateSettings={setSettings}
                onResetData={handleResetData}
                selectedYear={selectedYear}
                user={user}
                addToast={addToast}
                lang={lang}
                teachers={teachers}
                onAddTeacher={handleAddTeacher}
                onRemoveTeacher={handleRemoveTeacher}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

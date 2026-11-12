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
import { INITIAL_CLASSES_2026, INITIAL_CHECKLIST, INITIAL_SETTINGS, INITIAL_TEACHER_RECORDS, sortClassesMerahKuningBiru } from './data/initialData';
import { ClassLeaderData, VoteRecord, DailyChecklistTask, SystemSettings, UserSession, TeacherRecord, VoteCategory } from './types';
import { db } from './firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

export default function App() {
  const [lang, setLang] = useState<'ms' | 'zh'>('ms');

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_session');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return null;
  });

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  // Default to voting tab so teachers immediately see the voting screen upon login
  const [activeTab, setActiveTab] = useState<string>('voting');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);

  // Teachers master list with Name and IC support
  const [teachers, setTeachers] = useState<TeacherRecord[]>(() => {
    const savedV2 = localStorage.getItem('sistem_pemimpin_teachers_v2');
    if (savedV2) {
      try {
        const parsed = JSON.parse(savedV2);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].name) {
          return parsed.filter((t: TeacherRecord) => !t.name.toUpperCase().includes('ERIC CHUNG'));
        }
      } catch { /* ignore */ }
    }
    const legacySaved = localStorage.getItem('sistem_pemimpin_teachers');
    if (legacySaved) {
      try {
        const parsed = JSON.parse(legacySaved);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed
            .filter((t: string) => !t.toUpperCase().includes('ERIC CHUNG'))
            .map((name: string, idx: number) => {
              const matched = INITIAL_TEACHER_RECORDS.find((r) => r.name.toUpperCase() === name.toUpperCase());
              return matched || { name, ic: `85010112${String(idx + 1).padStart(4, '0')}` };
            });
        }
      } catch { /* ignore */ }
    }
    return INITIAL_TEACHER_RECORDS.filter((t) => !t.name.toUpperCase().includes('ERIC CHUNG'));
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

  // Votes with localStorage persistence and Cloud Firestore real-time sync
  const [votes, setVotes] = useState<VoteRecord[]>(() => {
    const saved = localStorage.getItem('sistem_pemimpin_votes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch { /* ignore */ }
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

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success', duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Real-time Firestore Sync Listeners for cross-device sync
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as SystemSettings);
      } else {
        // Auto-seed default settings to Cloud Firestore if missing
        setDoc(doc(db, 'settings', 'main'), INITIAL_SETTINGS).catch(console.error);
      }
    }, (err) => console.error('Settings sync error:', err));

    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (snap) => {
      if (!snap.empty) {
        const list: TeacherRecord[] = [];
        snap.forEach(d => list.push(d.data() as TeacherRecord));
        if (list.length > 0) setTeachers(list);
      } else {
        INITIAL_TEACHER_RECORDS.filter((t) => !t.name.toUpperCase().includes('ERIC CHUNG')).forEach((th) => {
          setDoc(doc(db, 'teachers', th.ic), th).catch(console.error);
        });
      }
    }, (err) => console.error('Teachers sync error:', err));

    const unsubClasses = onSnapshot(collection(db, 'classes'), (snap) => {
      if (!snap.empty) {
        const byYear: { [year: number]: ClassLeaderData[] } = {};
        snap.forEach(d => {
          const data = d.data() as ClassLeaderData & { year?: number };
          const yr = data.year || 2026;
          if (!byYear[yr]) byYear[yr] = [];
          byYear[yr].push(data);
        });
        if (Object.keys(byYear).length > 0) {
          for (const yr of Object.keys(byYear)) {
            byYear[Number(yr)] = sortClassesMerahKuningBiru(byYear[Number(yr)]);
          }
          setClassesByYear(byYear);
        }
      } else {
        INITIAL_CLASSES_2026.forEach((c) => {
          setDoc(doc(db, 'classes', `2026_${c.id}`), { ...c, year: 2026 }).catch(console.error);
        });
      }
    }, (err) => console.error('Classes sync error:', err));

    const unsubVotes = onSnapshot(collection(db, 'votes'), (snap) => {
      const list: VoteRecord[] = [];
      snap.forEach(d => {
        const data = d.data();
        list.push({
          id: d.id,
          year: Number(data.year) || 2026,
          voterId: String(data.voterId || ''),
          voterName: String(data.voterName || ''),
          category: data.category,
          candidateName: String(data.candidateName || ''),
          classId: String(data.classId || ''),
          timestamp: String(data.timestamp || new Date().toISOString()),
        });
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setVotes(list);
    }, (err) => {
      console.error('Votes sync error:', err);
      addToast('Ralat sambungan Firestore: ' + (err.message || 'Gagal menyegerak undian'), 'error');
    });

    const unsubChecklist = onSnapshot(collection(db, 'checklist'), (snap) => {
      if (!snap.empty) {
        const list: DailyChecklistTask[] = [];
        snap.forEach(d => list.push(d.data() as DailyChecklistTask));
        setChecklist(list);
      }
    }, (err) => console.error('Checklist sync error:', err));

    return () => {
      unsubSettings();
      unsubTeachers();
      unsubClasses();
      unsubVotes();
      unsubChecklist();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_teachers_v2', JSON.stringify(teachers));
    localStorage.setItem('sistem_pemimpin_teachers', JSON.stringify(teachers.map((t) => t.name)));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_classes', JSON.stringify(classesByYear));
  }, [classesByYear]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sistem_pemimpin_votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sistem_pemimpin_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('sistem_pemimpin_session');
    }
  }, [user]);

  const currentClasses = sortClassesMerahKuningBiru(classesByYear[selectedYear] || INITIAL_CLASSES_2026.map(c => ({ ...c })));

  const handleUpdateClass = (updated: ClassLeaderData) => {
    setClassesByYear((prev) => {
      const yearList = prev[selectedYear] || INITIAL_CLASSES_2026.map(c => ({ ...c }));
      const newList = yearList.map((item) => (item.id === updated.id ? updated : item));
      return { ...prev, [selectedYear]: newList };
    });
    setDoc(doc(db, 'classes', `${selectedYear}_${updated.id}`), { ...updated, year: selectedYear }).catch(console.error);
  };

  const teacherNames = teachers.map((t) => t.name);

  const handleAddTeacher = (name: string, ic: string) => {
    const cleanName = name.trim().toUpperCase();
    const cleanIc = ic.trim().replace(/[-\s]/g, '');
    if (teachers.some((t) => t.name.toUpperCase() === cleanName || t.ic === cleanIc)) return;
    setTeachers((prev) => [...prev, { name: cleanName, ic: cleanIc }].sort((a, b) => a.name.localeCompare(b.name)));
    setDoc(doc(db, 'teachers', cleanIc), { name: cleanName, ic: cleanIc }).catch(console.error);
  };

  const handleRemoveTeacher = (name: string) => {
    const target = teachers.find(t => t.name.toUpperCase() === name.toUpperCase());
    setTeachers((prev) => prev.filter((th) => th.name.toUpperCase() !== name.toUpperCase()));
    if (target) {
      deleteDoc(doc(db, 'teachers', target.ic)).catch(console.error);
    }
  };

  const handleCastVote = async (vote: Omit<VoteRecord, 'id' | 'timestamp'>) => {
    // Unique deterministic document ID per voter per category per year prevents duplicates across devices
    const cleanVoterId = (vote.voterId || 'voter').replace(/[^a-zA-Z0-9_-]/g, '_');
    const docId = `${vote.year}_${vote.category}_${cleanVoterId}`;
    const newRecord: VoteRecord = {
      id: docId,
      year: Number(vote.year) || 2026,
      voterId: String(vote.voterId || ''),
      voterName: String(vote.voterName || ''),
      category: vote.category,
      candidateName: String(vote.candidateName || ''),
      classId: String(vote.classId || ''),
      timestamp: new Date().toISOString(),
    };

    try {
      // 1. Immediately update local state and localStorage so the vote is NEVER 0
      setVotes((prev) => {
        const next = [newRecord, ...prev.filter(v => v.id !== docId)];
        localStorage.setItem('sistem_pemimpin_votes', JSON.stringify(next));
        return next;
      });

      // 2. Persist to Cloud Firestore
      await setDoc(doc(db, 'votes', docId), newRecord);

      // 3. Visual feedback: Exactly "Undian berjaya disahkan." and disappears after 0.5 seconds
      addToast('Undian berjaya disahkan.', 'success', 500);

      // 4. Advance parent state to next category
      setCurrentCategoryIndex((prev) => Math.min(prev + 1, 3));
    } catch (err: any) {
      console.error('Error writing vote to Firestore:', err);
      // Even if cloud write has network delay, vote is already kept in local state & storage
      addToast('Undian berjaya disahkan.', 'success', 500);
      setCurrentCategoryIndex((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleToggleChecklist = (id: string) => {
    let targetTask: DailyChecklistTask | undefined;
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          targetTask = { ...item, completed: !item.completed };
          return targetTask;
        }
        return item;
      })
    );
    if (targetTask) {
      setDoc(doc(db, 'checklist', id), targetTask).catch(console.error);
    }
    addToast('Status tugasan dikemaskini!', 'success');
  };

  const handleUpdateSettings = async (newSettings: SystemSettings) => {
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'main'), newSettings);
      addToast('Pengumuman sekolah berjaya dikemaskini dan disegerakkan ke pangkalan data awan!', 'success');
    } catch (err: any) {
      console.error('Error saving settings to Firestore:', err);
      addToast('Ralat menyimpan pengumuman ke cloud: ' + (err.message || 'Sila cuba lagi'), 'error');
    }
  };

  const handleResetTeachers = () => {
    setTeachers(INITIAL_TEACHER_RECORDS.filter((t) => !t.name.toUpperCase().includes('ERIC CHUNG')));
    addToast('Senarai guru telah ditetapkan semula.', 'info');
  };

  const handleResetClasses = () => {
    setClassesByYear({ 2026: INITIAL_CLASSES_2026 });
    addToast('Data kelas telah ditetapkan semula.', 'info');
  };

  const handleSeedDefaultClasses = () => {
    INITIAL_CLASSES_2026.forEach((c) => {
      setDoc(doc(db, 'classes', `2026_${c.id}`), { ...c, year: 2026 }).catch(console.error);
    });
    setClassesByYear((prev) => ({ ...prev, 2026: INITIAL_CLASSES_2026 }));
    addToast('Kelas 1M hingga 6B berjaya disemai (seed) ke Cloud Firestore!', 'success');
  };

  const handleResetVotes = async () => {
    try {
      const snap = await getDocs(collection(db, 'votes'));
      const batchPromises = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(batchPromises);
      setVotes([]);
      addToast('Semua data undian telah dipadam sepenuhnya dari Cloud Firestore.', 'info');
    } catch (err: any) {
      console.error('Error deleting votes:', err);
      setVotes([]);
      addToast('Data undian telah ditetapkan semula.', 'info');
    }
  };

  const handleImportData = (data: any) => {
    try {
      if (data.teachers && Array.isArray(data.teachers)) {
        setTeachers(data.teachers);
        data.teachers.forEach((th: TeacherRecord) => {
          setDoc(doc(db, 'teachers', th.ic), th).catch(console.error);
        });
      }
      if (data.classesByYear && typeof data.classesByYear === 'object') {
        setClassesByYear(data.classesByYear);
        for (const [yr, list] of Object.entries(data.classesByYear)) {
          (list as ClassLeaderData[]).forEach((c) => {
            setDoc(doc(db, 'classes', `${yr}_${c.id}`), { ...c, year: Number(yr) }).catch(console.error);
          });
        }
      }
      if (data.votes && Array.isArray(data.votes)) {
        setVotes(data.votes);
        data.votes.forEach((v: VoteRecord) => {
          setDoc(doc(db, 'votes', v.id), v).catch(console.error);
        });
      }
      if (data.checklist && Array.isArray(data.checklist)) {
        setChecklist(data.checklist);
        data.checklist.forEach((ch: DailyChecklistTask) => {
          setDoc(doc(db, 'checklist', ch.id), ch).catch(console.error);
        });
      }
      if (data.settings && typeof data.settings === 'object') {
        setSettings(data.settings);
        setDoc(doc(db, 'settings', 'main'), data.settings).catch(console.error);
      }
      addToast('Data sistem berjaya diimport dan disync ke cloud!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Gagal mengimport fail JSON. Format tidak sah.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-[#EAB308] selection:text-slate-950 pb-32 sm:pb-28 md:pb-16 w-full max-w-full overflow-x-hidden">
      {/* Slow Moving Automatic Neon Background for Main App Screen */}
      <NeonBackground variant="app" />

      <LoginModal
        isOpen={!user}
        onLogin={(sess) => {
          setUser(sess);
          setActiveTab('voting');
          setCurrentCategoryIndex(0);
        }}
        lang={lang}
        setLang={setLang}
        teachers={teachers}
      />

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
            onLogout={() => {
              localStorage.removeItem('sistem_pemimpin_session');
              setUser(null);
              setActiveTab('voting');
              setCurrentCategoryIndex(0);
            }}
            lang={lang}
            setLang={setLang}
          />

          {settings.announcement && (
            <div className="bg-[#EAB308] text-slate-950 py-2 px-3 text-center text-xs font-extrabold shadow-inner flex items-center justify-center gap-2 border-b border-amber-500 w-full overflow-hidden">
              <span className="px-1.5 py-0.5 rounded-md bg-[#0F172A] text-amber-300 uppercase text-[9px] tracking-wider font-mono shrink-0">PENGUMUMAN</span>
              <span className="truncate">{settings.announcement}</span>
            </div>
          )}

          <main className="max-w-7xl mx-auto px-1.5 sm:px-4 md:px-6 lg:px-8 pt-2.5 sm:pt-6 md:pt-8 w-full max-w-full overflow-x-hidden">
            {activeTab === 'classes' && (
              <TabClasses
                classesData={currentClasses}
                onUpdateClass={handleUpdateClass}
                selectedYear={selectedYear}
                user={user}
                addToast={addToast}
                lang={lang}
                teachers={teacherNames}
              />
            )}

            {activeTab === 'voting' && (
              <TabVoting
                classesData={currentClasses}
                votes={votes}
                onCastVote={handleCastVote}
                onLogout={() => {
                  localStorage.removeItem('sistem_pemimpin_session');
                  setUser(null);
                }}
                currentCategoryIndex={currentCategoryIndex}
                setCurrentCategoryIndex={setCurrentCategoryIndex}
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
              user.role === 'admin' ? (
                <TabLeaderboard
                  votes={votes}
                  classesData={currentClasses}
                  selectedYear={selectedYear}
                  lang={lang}
                  teachers={teacherNames}
                  user={user}
                  addToast={addToast}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center max-w-xl mx-auto shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800">Akses Terhad Pentadbir</h3>
                  <p className="text-xs text-slate-600 mt-1">Papan analisis dan keputusan undian hanya boleh diakses oleh pihak Pentadbir / Admin.</p>
                </div>
              )
            )}

            {activeTab === 'admin' && (
              <TabAdmin
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetTeachers={handleResetTeachers}
                onResetClasses={handleResetClasses}
                onResetVotes={handleResetVotes}
                selectedYear={selectedYear}
                user={user}
                addToast={addToast}
                lang={lang}
                teachers={teachers}
                onAddTeacher={handleAddTeacher}
                onRemoveTeacher={handleRemoveTeacher}
                classesByYear={classesByYear}
                votes={votes}
                checklist={checklist}
                onImportData={handleImportData}
                onSeedDefaultClasses={handleSeedDefaultClasses}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, User, KeyRound, School, CheckCircle2, Globe } from 'lucide-react';
import { Role, UserSession } from '../types';
import { t } from '../translations';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (session: UserSession) => void;
  lang: 'ms' | 'zh';
  setLang: (lang: 'ms' | 'zh') => void;
  teachers: string[];
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, lang, setLang, teachers }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('teacher');
  const [username, setUsername] = useState('XCC5305');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [verifiedTeacherName, setVerifiedTeacherName] = useState<string | null>(null);

  if (!isOpen) return null;

  const dict = t[lang].login;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'admin') {
      if (username.trim().toLowerCase() === 'admin' && password.trim() === 'mptan') {
        onLogin({ role: 'admin', username: 'admin', name: 'Admin / Guru Penasihat Utama' });
      } else {
        setError(lang === 'ms' ? 'ID Staff atau Kata Laluan Admin tidak sah' : '用户名或管理员密码无效');
      }
    } else if (selectedRole === 'teacher') {
      if (username.trim().toUpperCase() !== 'XCC5305') {
        setError(lang === 'ms' ? 'ID Login Guru mesti XCC5305' : '教师登录ID必须为 XCC5305');
        return;
      }
      const passTrim = password.trim().toUpperCase();
      const foundTeacher = teachers.find((th) => {
        const firstName = th.trim().split(' ')[0].toUpperCase();
        return firstName === passTrim;
      });

      if (foundTeacher) {
        setVerifiedTeacherName(foundTeacher);
      } else {
        setError(lang === 'ms' ? 'Kata laluan tidak sah. Sila masukkan nama pertama guru.' : '密码无效。请输入正确的教师名字首个单词。');
      }
    }
  };

  const handleConfirmTeacherLogin = () => {
    if (!verifiedTeacherName) return;
    onLogin({
      role: 'teacher',
      username: 'XCC5305',
      name: verifiedTeacherName,
    });
  };

  const handleQuickDemo = (role: Role) => {
    setSelectedRole(role);
    setVerifiedTeacherName(null);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('mptan');
    } else if (role === 'teacher') {
      setUsername('XCC5305');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/90 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-400/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-blue-950 to-[#0F172A] p-6 text-white text-center relative border-b border-amber-400/20">
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={() => setLang(lang === 'ms' ? 'zh' : 'ms')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 rounded-xl transition shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ms' ? '中文' : 'BM'}</span>
            </button>
          </div>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-lg border-2 border-amber-300 overflow-hidden">
            <img
              src="/assets/aistudio/school_logo_466b8a00.png"
              alt="Logo SJK (C) Chung Hwa Kota Belud"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">{dict.title}</h2>
          <p className="text-xs text-amber-300 mt-1 font-medium">{dict.subtitle}</p>
        </div>

        {verifiedTeacherName ? (
          <div className="p-8 space-y-6 bg-slate-900 text-slate-100 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Pengesahan Guru Berjaya / 教师身份验证成功</p>
              <h3 className="text-xl font-extrabold text-white">{verifiedTeacherName}</h3>
              <p className="text-xs text-slate-400 mt-2">ID Login: <code className="text-amber-300 font-mono">XCC5305</code></p>
            </div>

            <button
              onClick={handleConfirmTeacherLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-[#EAB308] hover:bg-amber-500 text-slate-950 font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              <span>Sahkan & Masuk Sistem (Verify & Enter)</span>
            </button>

            <button
              onClick={() => setVerifiedTeacherName(null)}
              className="text-xs text-slate-400 hover:text-white transition underline"
            >
              Kembali / Back
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-900 text-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                {dict.roleLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('teacher')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition ${
                    selectedRole === 'teacher'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md'
                      : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <UserCheck className="w-5 h-5 mb-1.5 text-amber-400" />
                  <span>{dict.teacherRole}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition ${
                    selectedRole === 'admin'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md'
                      : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mb-1.5 text-amber-400" />
                  <span>{dict.adminRole}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {dict.staffId}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={selectedRole === 'teacher' ? 'XCC5305' : 'admin'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {dict.password}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#EAB308] hover:bg-amber-500 text-[#0F172A] font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{dict.submit}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, User, KeyRound, Globe, AlertCircle } from 'lucide-react';
import { Role, UserSession } from '../types';
import { NeonBackground } from './NeonBackground';
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
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachers[0] || 'CHIA MEE HIE');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const dict = t[lang].login;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'admin') {
      if (adminUsername.trim().toLowerCase() === 'admin' && password.trim() === 'mptan') {
        onLogin({ role: 'admin', username: 'admin', name: 'Admin / Guru Penasihat Utama' });
      } else {
        setError(lang === 'ms' ? 'ID Staff atau Kata Laluan Admin tidak sah. (Password: mptan)' : '用户名或管理员密码无效。(密码: mptan)');
      }
    } else if (selectedRole === 'teacher') {
      if (!selectedTeacher) {
        setError(lang === 'ms' ? 'Sila pilih nama guru anda.' : '请选择您的教师姓名。');
        return;
      }

      // Password for teachers is their IC number without '-'
      const cleanIC = password.trim().replace(/[-\s]/g, '');

      if (!/^\d{10,12}$/.test(cleanIC)) {
        setError(
          lang === 'ms'
            ? 'Kata laluan mestilah nombor Kad Pengenalan (IC) tanpa tanda "-" (contoh: 880215125544).'
            : '密码必须是身份证号码（IC），不含符号"-"（例如：880215125544）。'
        );
        return;
      }

      onLogin({
        role: 'teacher',
        username: cleanIC,
        name: selectedTeacher,
      });
    }
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none bg-[#040714]">
      {/* Slow Moving Automatic Neon Background (No mouse interaction needed) */}
      <NeonBackground variant="login" />

      {/* Language Switcher in Corner */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={() => setLang(lang === 'ms' ? 'zh' : 'ms')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-cyan-300 bg-[#0F172A]/85 hover:bg-[#0F172A] border border-cyan-400/40 rounded-xl transition shadow-lg backdrop-blur-md"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ms' ? '中文 (ZH)' : 'BM'}</span>
        </button>
      </div>

      {/* Frosted Glass Login Card with Neon Glow Accents */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0B1124]/90 backdrop-blur-2xl border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#070D1E] via-blue-950/80 to-[#070D1E] p-6 text-white text-center relative border-b border-cyan-500/20">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20 border-2 border-amber-300 overflow-hidden p-1">
            <img
              src="/school_logo.jpg"
              alt="Logo SJK (C) Chung Hwa Kota Belud"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">{dict.title}</h2>
          <p className="text-xs text-amber-300 mt-1 font-medium">{dict.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-[#0B1124]/70 text-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              {dict.roleLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition ${
                  selectedRole === 'teacher'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <UserCheck className="w-5 h-5 mb-1.5 text-cyan-400" />
                <span>{dict.teacherRole}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition ${
                  selectedRole === 'admin'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-1.5 text-cyan-400" />
                <span>{dict.adminRole}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {selectedRole === 'teacher' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {dict.selectTeacher}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/95 py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    {teachers.map((th) => (
                      <option key={th} value={th} className="bg-slate-900 text-white">
                        {th}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
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
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/95 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {selectedRole === 'teacher' ? dict.password : 'Kata Laluan Admin'}
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={selectedRole === 'teacher' ? 'cth: 880215125544' : '••••••'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/95 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                />
              </div>
              {selectedRole === 'teacher' && (
                <p className="text-[11px] text-amber-300/90 mt-1.5">
                  {dict.passwordHint}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(234,179,8,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{dict.submit}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

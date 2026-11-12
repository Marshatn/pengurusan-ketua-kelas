import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, User, KeyRound, Globe, AlertCircle } from 'lucide-react';
import { Role, UserSession, TeacherRecord } from '../types';
import { NeonBackground } from './NeonBackground';
import { t } from '../translations';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (session: UserSession) => void;
  lang: 'ms' | 'zh';
  setLang: (lang: 'ms' | 'zh') => void;
  teachers: (TeacherRecord | string)[];
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, lang, setLang, teachers }) => {
  const normalizedTeachers: TeacherRecord[] = teachers.map((th, idx) => {
    if (typeof th === 'string') {
      return { name: th, ic: `85010112${String(idx + 1).padStart(4, '0')}` };
    }
    return th;
  });

  const [selectedRole, setSelectedRole] = useState<Role>('teacher');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reset inputs whenever modal opens (e.g. after clean logout)
  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setError('');
  };

  if (!isOpen) return null;

  const dict = t[lang].login;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'admin') {
      if (adminUsername.trim().toLowerCase() === 'admin' && password.trim() === 'mptan') {
        onLogin({ role: 'admin', username: 'admin', name: 'Admin Utama' });
      } else {
        setError(
          lang === 'ms'
            ? 'ID Staff atau Kata Laluan Admin tidak sah.'
            : '用户名或管理员密码无效。'
        );
      }
    } else if (selectedRole === 'teacher') {
      const cleanIC = password.trim().replace(/[-\s]/g, '');

      if (!/^\d{10,12}$/.test(cleanIC)) {
        setError(
          lang === 'ms'
            ? 'Sila masukkan nombor Kad Pengenalan (IC) sah (10 - 12 digit nombor tanpa tanda "-").'
            : '请输入有效的身份证号码（IC）（10至12位数字，不含符号"-"）。'
        );
        return;
      }

      const matchedByIC = normalizedTeachers.find(
        (t) => t.ic.replace(/[-\s]/g, '') === cleanIC
      );

      if (!matchedByIC) {
        setError(
          lang === 'ms'
            ? 'Nombor Kad Pengenalan (IC) tidak dijumpai dalam senarai guru yang sah.'
            : '在有效的教师名单中未找到该身份证号码（IC）。'
        );
        return;
      }

      onLogin({
        role: 'teacher',
        username: cleanIC,
        name: matchedByIC.name,
      });
    }
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
      <NeonBackground variant="login" />

      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={() => setLang(lang === 'ms' ? 'zh' : 'ms')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-white/90 hover:bg-white border border-sky-300 rounded-xl transition shadow-lg backdrop-blur-md cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'ms' ? '中文 (ZH)' : 'BM'}</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-xl border border-sky-200/90 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        <div className="bg-gradient-to-r from-[#0F172A] via-blue-900 to-[#0F172A] p-6 text-white text-center relative border-b border-amber-400/30">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-lg border-2 border-amber-300 overflow-hidden p-1">
            <img
              src="/school_logo.jpg"
              alt="Logo SJK (C) Chung Hwa Kota Belud"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">{dict.title}</h2>
          <p className="text-xs text-amber-300 mt-1 font-medium">{dict.subtitle} (Cloud Sync Enabled)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white text-slate-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {dict.roleLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                  selectedRole === 'teacher'
                    ? 'border-amber-400 bg-amber-50/90 text-slate-900 shadow-sm scale-[1.02]'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                }`}
              >
                <UserCheck className="w-5 h-5 mb-1.5 text-amber-500" />
                <span>{dict.teacherRole}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-amber-400 bg-amber-50/90 text-slate-900 shadow-sm scale-[1.02]'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-1.5 text-amber-500" />
                <span>{dict.adminRole}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {selectedRole === 'admin' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {selectedRole === 'teacher' ? 'Nombor Kad Pengenalan (IC Guru)' : 'Kata Laluan Admin'}
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type={selectedRole === 'teacher' ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder={selectedRole === 'teacher' ? 'cth: 880215125544' : '••••••'}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#EAB308] hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
          >
            <Lock className="w-4 h-4" />
            <span>{dict.submit}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

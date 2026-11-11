import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X, Check, HelpCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ lang?: 'ms' | 'zh' }> = ({ lang = 'ms' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Show guided instructions for iOS or other mobile browsers
      setShowGuide(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md transition whitespace-nowrap shrink-0 border border-amber-300 cursor-pointer"
        title="Pasang aplikasi ke telefon / desktop (PWA)"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{lang === 'ms' ? 'Pasang App (PWA)' : '安装App (PWA)'}</span>
        <span className="sm:hidden">PWA</span>
      </button>

      {/* Guided Install Modal for Mobile / Non-Automated Browsers */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-400/40 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
              {isIOS ? <Smartphone className="w-6 h-6" /> : <Download className="w-6 h-6" />}
            </div>

            <h3 className="text-lg font-bold text-white">
              {lang === 'ms' ? 'Pasang Sistem (PWA) di Telefon' : '在手机上安装系统 (PWA)'}
            </h3>

            {isIOS ? (
              <div className="mt-3 text-xs text-slate-300 space-y-2.5">
                <p className="font-semibold text-amber-300">
                  {lang === 'ms' ? 'Langkah Pemasangan di iPhone / iPad (Safari):' : '在iPhone / iPad上的安装步骤：'}
                </p>
                <div className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Buka pelayar <strong>Safari</strong> dan tekan butang <strong>Kongsi (Share / ⎋)</strong>.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>Skrol ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Skrin Utama).</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <span>Tekan <strong>Add</strong> di penjuru atas. Ikon sekolah akan muncul di skrin telefon anda!</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-300 space-y-2.5">
                <p className="font-semibold text-amber-300">
                  {lang === 'ms' ? 'Langkah Pemasangan di Android / Chrome:' : '在Android / Chrome上的安装步骤：'}
                </p>
                <div className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Tekan ikon <strong>tiga titik (⋮)</strong> di sudut atas pelayar Chrome.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>Pilih <strong>"Install app"</strong> atau <strong>"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-800/70 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <span>Sahkan pemasangan untuk menggunakan sistem seperti aplikasi telefon sebenar!</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition cursor-pointer"
            >
              Faham & Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

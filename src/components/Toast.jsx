import { useEffect, useRef, useState } from 'react';
import { subscribeToast } from '../game/engine';

export default function Toast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    return subscribeToast((t) => {
      setToast(t);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 2500);
    });
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-slate-900/90 dark:bg-slate-100/95 dark:text-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 transform transition-all duration-300 pointer-events-none ${
        toast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <span>{toast?.icon ?? '💩'}</span>
      <span>{toast?.msg ?? ''}</span>
    </div>
  );
}

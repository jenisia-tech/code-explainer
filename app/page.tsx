'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020617] text-sky-400 flex items-center justify-center font-mono pixel-game-bg">
      <div className="text-center space-y-3">
        <div className="inline-block w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sky-300 font-semibold text-xs tracking-wider terminal-cursor">Loading Code Explainer Academy...</p>
      </div>
    </div>
  );
}
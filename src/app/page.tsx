import SoundMixer from '@/components/CafeDeReceipt/SoundMixer';
import ReceiptPrinter from '@/components/CafeDeReceipt/ReceiptPrinter';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121110] text-zinc-100 flex flex-col justify-between p-4 sm:p-8 font-receipt select-none">
      {/* 1. 상단 감성 배너 / 헤더 */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 px-2 border-b border-zinc-800/80 text-xs text-zinc-500 tracking-wider">
        {/* 좌측: 상태 인디케이터 */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-zinc-400">STATUS: OPEN</span>
        </div>

        {/* 중앙: 타이틀 */}
        <div className="text-base sm:text-lg font-bold text-zinc-200 tracking-widest font-serif">
          CAFÉ DE RECEIPT
        </div>

        {/* 우측: 포트폴리오 링크 (새창 열기) */}
        <a
          href="https://default-plus.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-200/70 hover:text-amber-100 font-mono text-[11px] sm:text-xs transition-colors cursor-pointer underline underline-offset-4 decoration-amber-500/40"
        >
          [ Default_Plus ]
        </a>
      </header>

      {/* 2. 중앙 메인 컨텐츠 (오디오 믹서 + 영수증 프린터) */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-8">
        {/* 좌측: 사운드 믹서 (4컬럼) */}
        <div className="lg:col-span-4">
          <SoundMixer />
        </div>

        {/* 우측: 영수증 프린터 (8컬럼) */}
        <div className="lg:col-span-8">
          <ReceiptPrinter />
        </div>
      </div>

      {/* 3. 하단 푸터 */}
      <footer className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 px-2 border-t border-zinc-800/80 text-xs text-zinc-500 tracking-wider font-mono">
        <div>Seoul / KR</div>
        <div className="hidden md:block italic text-zinc-600">
          CAFÉ De Receipt _ v1.0.1
        </div>
        <div>© 2026 Default_Plus</div>
      </footer>
    </main>
  );
}
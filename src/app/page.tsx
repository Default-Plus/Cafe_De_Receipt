import SoundMixer from '@/components/CafeDeReceipt/SoundMixer';
import ReceiptPrinter from '@/components/CafeDeReceipt/ReceiptPrinter';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121110] text-zinc-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* 12컬럼 그리드: 믹서(4) / 영수증 프린터(8) */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 좌측: 오디오 믹서 (컴팩트 4컬럼) */}
        <div className="lg:col-span-4">
          <SoundMixer />
        </div>

        {/* 우측: 영수증 프린터 (메인 8컬럼) */}
        <div className="lg:col-span-8">
          <ReceiptPrinter />
        </div>
      </div>
    </main>
  );
}
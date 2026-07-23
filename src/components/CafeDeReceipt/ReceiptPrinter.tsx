'use client';

import React, { useState, useEffect } from 'react';
import ReceiptPaper, { ReceiptData } from './ReceiptPaper';

export default function ReceiptPrinter() {
  const [mode, setMode] = useState<'goal' | 'letter'>('goal');
  const [goal, setGoal] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');

  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData | null>(null);
  const [history, setHistory] = useState<ReceiptData[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cafe_receipt_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse receipt history', e);
      }
    }
  }, []);

  const handlePrint = () => {
    if (!goal.trim()) return;

    const audio = new Audio('/audio/print.mp3');
    audio.play();

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newReceipt: ReceiptData = {
      id: Date.now().toString(),
      type: mode,
      goal,
      inspiration,
      recipient: mode === 'letter' ? recipient : undefined,
      sender: mode === 'letter' ? sender : undefined,
      timestamp: formattedDate,
    };

    setCurrentReceipt(newReceipt);
    setIsPrinting(true);

    const updatedHistory = [newReceipt, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('cafe_receipt_history', JSON.stringify(updatedHistory));

    setTimeout(() => {
      setIsPrinting(false);
    }, 2500);
  };

  const deleteSingleHistory = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('cafe_receipt_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm('모든 영수증 히스토리를 삭제하시겠습니까?')) {
      setHistory([]);
      localStorage.removeItem('cafe_receipt_history');
    }
  };

  return (
    <div className="flex flex-col h-full p-8 sm:p-10 bg-zinc-900/40 rounded-3xl border border-zinc-800/80 backdrop-blur-md text-zinc-100 justify-between shadow-2xl font-receipt">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-amber-50 flex items-center gap-3">
            <span>🖨️</span> Receipt Machine
          </h2>
          
          {(history.length > 0 || showHistory) && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-amber-300/80 hover:text-amber-200 underline font-mono cursor-pointer transition-colors"
            >
              {showHistory ? '✕ CLOSE HISTORY' : `📜 HISTORY (${history.length})`}
            </button>
          )}
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          오늘의 목표나 전하고 싶은 글귀를 영수증에 담아 인쇄해보세요.
        </p>

        {/* 모드 선택 탭 버튼 */}
        {!showHistory && (
          <div className="flex gap-2 mb-6 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
            <button
              onClick={() => setMode('goal')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'goal'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🎯 FOCUS GOAL
            </button>
            <button
              onClick={() => setMode('letter')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'letter'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ✉️ CAFÉ LETTER
            </button>
          </div>
        )}

        {showHistory ? (
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
              <span>SAVED RECEIPTS ({history.length})</span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-red-400/80 hover:text-red-400 cursor-pointer font-bold"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 text-xs">
                저장된 영수증이 없습니다.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="scale-95 origin-top mb-6">
                  <ReceiptPaper
                    receipt={item}
                    showSaveButton={true}
                    onDelete={deleteSingleHistory}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          /* 입력 폼 (모드별 분기) */
          <div className="space-y-4">
            {mode === 'goal' ? (
              <>
                <div>
                  <label className="block text-xs text-amber-200/80 mb-1.5 tracking-wider">
                    TODAY'S GOAL *
                  </label>
                  <input
                    type="text"
                    placeholder="예: Cafe De Receipt 개발"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-950/70 border border-zinc-700/60 rounded-2xl text-sm focus:outline-none focus:border-amber-500/80 text-zinc-100 placeholder-zinc-600 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs text-amber-200/80 mb-1.5 tracking-wider">
                    INSPIRATION / NOTE
                  </label>
                  <textarea
                    rows={2}
                    placeholder="예: 카페, 영수증, 공간, 기록, 소리, 집중, 편지"
                    value={inspiration}
                    onChange={(e) => setInspiration(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-950/70 border border-zinc-700/60 rounded-2xl text-sm focus:outline-none focus:border-amber-500/80 text-zinc-100 placeholder-zinc-600 resize-none transition-all shadow-inner"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-amber-200/80 mb-1.5 tracking-wider">
                      TO (받는 사람)
                    </label>
                    <input
                      type="text"
                      placeholder="받는 사람"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950/70 border border-zinc-700/60 rounded-xl text-sm focus:outline-none focus:border-amber-500/80 text-zinc-100 placeholder-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-amber-200/80 mb-1.5 tracking-wider">
                      FROM (보내는 사람)
                    </label>
                    <input
                      type="text"
                      placeholder="보내는 사람"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950/70 border border-zinc-700/60 rounded-xl text-sm focus:outline-none focus:border-amber-500/80 text-zinc-100 placeholder-zinc-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-amber-200/80 mb-1.5 tracking-wider">
                    LETTER / NOTE *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="예: 고생했어 오늘도."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-950/70 border border-zinc-700/60 rounded-2xl text-sm focus:outline-none focus:border-amber-500/80 text-zinc-100 placeholder-zinc-600 resize-none transition-all shadow-inner"
                  />
                </div>
              </>
            )}

            <button
              onClick={handlePrint}
              disabled={!goal.trim() || isPrinting}
              className="w-full py-4 bg-amber-100 hover:bg-amber-200 active:scale-[0.99] disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-base rounded-2xl transition-all duration-200 tracking-wider shadow-xl shadow-amber-950/20 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {isPrinting ? 'PRINTING...' : mode === 'letter' ? 'PRINT LETTER ✉️' : 'PRINT RECEIPT ↵'}
            </button>
          </div>
        )}
      </div>

      {!showHistory && (
        <div className="mt-8 relative flex flex-col items-center">
          <div className="w-full max-w-md h-3.5 bg-zinc-950 rounded-full border border-zinc-700/60 shadow-inner z-10" />

          <div className="w-full flex justify-center -mt-2 overflow-hidden min-h-[320px] pt-2 pb-4">
            {currentReceipt && (
              <ReceiptPaper
                receipt={currentReceipt}
                isPrinting={isPrinting}
                showSaveButton={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React from 'react';
import html2canvas from 'html2canvas';

export interface ReceiptData {
  id: string;
  type?: 'goal' | 'letter'; // 모드 타입 추가
  goal: string;
  inspiration: string;
  recipient?: string; // 받는 사람 (편지 모드)
  sender?: string;    // 보내는 사람 (편지 모드)
  timestamp: string;
}

interface ReceiptPaperProps {
  receipt: ReceiptData;
  isPrinting?: boolean;
  showSaveButton?: boolean;
  onDelete?: (id: string) => void;
}

export default function ReceiptPaper({
  receipt,
  isPrinting = false,
  showSaveButton = true,
  onDelete,
}: ReceiptPaperProps) {
  const { goal, inspiration, timestamp, id, type = 'goal', recipient, sender } = receipt;

  const handleDownloadImage = async () => {
    const element = document.getElementById(`receipt-paper-${id}`);
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `cafe-de-receipt-${id.slice(0, 8)}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md relative group">
      <div
        id={`receipt-paper-${id}`}
        className={`w-full bg-[#fbf9f5] text-zinc-800 p-8 shadow-2xl font-receipt text-sm border-t-8 border-dashed border-zinc-400/40 transition-all duration-700 ease-out origin-top relative ${
          isPrinting ? 'animate-receipt-print' : 'opacity-100 translate-y-0'
        }`}
        style={{
          boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.4)',
        }}
      >
        {onDelete && !isPrinting && (
          <button
            onClick={() => onDelete(id)}
            title="영수증 삭제"
            className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-200/60 transition-colors cursor-pointer text-xs font-bold"
          >
            ✕
          </button>
        )}

        {/* 헤더 */}
        <div className="text-center border-b border-dashed border-zinc-400 pb-5 mb-5">
          <h1 className="text-lg font-bold tracking-widest uppercase text-zinc-900">
            {type === 'letter' ? 'CAFÉ LETTER' : 'CAFÉ DE RECEIPT'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">----------------------------------------</p>
          <p className="text-xs text-zinc-500 mt-0.5">{timestamp}</p>
        </div>

        {/* 본문 (타입에 따른 분기) */}
        {type === 'letter' ? (
          <div className="space-y-4 mb-8">
            {recipient && (
              <p className="text-xs font-bold text-zinc-500 tracking-wider">
                TO. {recipient}
              </p>
            )}
            <p className="text-base text-zinc-900 whitespace-pre-wrap leading-relaxed italic my-4">
              "{goal}"
            </p>
            {sender && (
              <p className="text-xs font-bold text-zinc-500 tracking-wider text-right">
                FROM. {sender}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-5 mb-8">
            <div>
              <span className="text-zinc-400 block text-xs uppercase font-semibold">
                [ TODAY'S FOCUS ]
              </span>
              <p className="text-base font-bold text-zinc-900 mt-1.5 whitespace-pre-wrap leading-relaxed">
                {goal || '오늘의 목표를 입력해주세요.'}
              </p>
            </div>

            {inspiration && (
              <div className="border-t border-dotted border-zinc-300 pt-4">
                <span className="text-zinc-400 block text-xs uppercase font-semibold">
                  [ INSPIRATION NOTE ]
                </span>
                <p className="text-zinc-700 mt-1.5 italic whitespace-pre-wrap leading-relaxed text-sm">
                  "{inspiration}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* 푸터 & 바코드 */}
        <div className="border-t border-dashed border-zinc-400 pt-5 text-center space-y-4">
          <div className="flex justify-between text-xs text-zinc-500 font-medium">
            <span>{type === 'letter' ? 'RECOREDED MOMENT' : 'TAX INCLUDED'}</span>
            <span>{type === 'letter' ? 'IN RECEIPT' : '100% FOCUS'}</span>
          </div>

          <div className="flex justify-center items-center gap-1.5 h-10 py-1 opacity-80">
            {[2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1].map((w, i) => (
              <span
                key={i}
                className="bg-zinc-800 h-full inline-block"
                style={{ width: `${w * 1.8}px` }}
              />
            ))}
          </div>

          <p className="text-xs text-zinc-400 tracking-wider pt-1">
            {type === 'letter' ? 'SEND WITH HEART' : 'THANK YOU FOR YOUR FOCUS'}
          </p>
        </div>
      </div>

      {showSaveButton && !isPrinting && (
        <button
          onClick={handleDownloadImage}
          className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-200 text-xs font-receipt rounded-xl border border-zinc-700/60 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          💾 SAVE AS PNG
        </button>
      )}
    </div>
  );
}
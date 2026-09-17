# Café De Receipt

Web Audio API 기반의 멀티트랙 앰비언트 오디오 믹서 및 영수증 렌더링 웹 애플리케이션입니다.

- **Deployment**: https://cafe-de-receipt.vercel.app/
- **Stack**: Next.js 14 (App Router), TypeScript, Web Audio API, Tailwind CSS, html2canvas

---

## Architecture Overview

### 1. Web Audio API Pipeline (`src/hooks/useAudioMixer.ts`)

브라우저 표준 오디오 인터페이스를 제어하여 멀티트랙 음원을 처리합니다.

- **Audio Graph**: `HTMLAudioElement` -> `MediaElementAudioSourceNode` -> `GainNode` -> `AudioContext.destination`
- **Volume Fading**: 슬라이더 조작 시 급격한 진폭 변화로 인한 디지털 팝핑 노이즈(Clicking/Clipping)를 방지하기 위해 선형 값 할당 대신 지수 감쇠 메서드인 `gainNode.gain.setTargetAtTime(targetValue, audioContext.currentTime, 0.05)`를 적용했습니다.
- **Autoplay Handling**: 브라우저 자동 재생 정책에 대응하기 위해 사용자 인터랙션 발생 시 `AudioContext.state`를 확인하고, `suspended` 상태인 경우 `resume()`을 비동기로 호출합니다.
- **Resource Lifecycle**: 컴포넌트 언마운트 시 `useEffect` 클린업 단계에서 `AudioContext.close()`를 호출하여 브라우저 하드웨어 점유 및 메모리 누수를 차단합니다. 리렌더링 시 노드 인스턴스 중복 생성을 방지하기 위해 `useRef(new Map())` 캐싱 구조를 사용합니다.

### 2. Rendering & Export Pipeline (`src/components/CafeDeReceipt/`)

- **Print Animation**: POS 프린터의 물리적 출력 효과를 구현하기 위해 CSS `clip-path` 및 `translateY` 트랜지션을 적용했습니다.
- **Canvas Rasterization**: `html2canvas`를 사용하여 영수증 DOM 노드를 2배수(`scale: 2`) 캔버스로 변환 후 고해상도 PNG 포맷으로 다운로드합니다.
- **Client Persistence**: 영수증 입력 데이터와 발행 내역은 `localStorage` 인터페이스를 통해 브라우저 세션 간 유지됩니다.

---

## Directory Structure

```
cafe_de_receipt/
├── public/
│   └── audio/              # 오디오 소스 에셋 (.mp3)
├── src/
│   ├── app/                # App Router 레이아웃 및 페이지
│   ├── components/
│   │   └── CafeDeReceipt/  # SoundMixer, ReceiptPrinter, ReceiptPaper
│   └── hooks/
│       └── useAudioMixer.ts # Web Audio 그래프 제어 커스텀 훅
├── package.json
└── tsconfig.json
```

---


## Development

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
import { useEffect, useRef, useState } from 'react';

export type SoundType = 'rain' | 'drip' | 'cafe';

interface SoundConfig {
  id: SoundType;
  label: string;
  src: string;
}

export const SOUND_LIST: SoundConfig[] = [
  { id: 'rain', label: '빗소리', src: '/audio/rain.mp3' },
  { id: 'drip', label: '드립 커피', src: '/audio/drip.mp3' },
  { id: 'cafe', label: '카페 소음', src: '/audio/cafe.mp3' },
];

export function useAudioMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState<Record<SoundType, number>>({
    rain: 0.5,
    drip: 0.3,
    cafe: 0.4,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElementsRef = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const gainNodesRef = useRef<Map<SoundType, GainNode>>(new Map());

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    SOUND_LIST.forEach(({ id, src }) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.crossOrigin = 'anonymous';

      const track = ctx.createMediaElementSource(audio);
      const gainNode = ctx.createGain();

      gainNode.gain.value = volumes[id];

      track.connect(gainNode);
      gainNode.connect(ctx.destination);

      audioElementsRef.current.set(id, audio);
      gainNodesRef.current.set(id, gainNode);
    });

    return () => {
      ctx.close();
    };
  }, []);

  const togglePlay = async () => {
    if (!audioCtxRef.current) return;

    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audioElementsRef.current.forEach((audio) => audio.pause());
      setIsPlaying(false);
    } else {
      audioElementsRef.current.forEach((audio) => audio.play());
      setIsPlaying(true);
    }
  };

  const changeVolume = (id: SoundType, value: number) => {
    setVolumes((prev) => ({ ...prev, [id]: value }));
    const gainNode = gainNodesRef.current.get(id);
    if (gainNode && audioCtxRef.current) {
      gainNode.gain.setTargetAtTime(value, audioCtxRef.current.currentTime, 0.05);
    }
  };

  return {
    isPlaying,
    volumes,
    togglePlay,
    changeVolume,
  };
}
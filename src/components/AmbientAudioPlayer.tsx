import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { useCMS } from '../cms';

export const AmbientAudioPlayer: React.FC = () => {
  const { themeMode } = useCMS();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const tracks = [
    { title: 'Boutique Jazz & Vinyl', freq: 432 },
    { title: 'Rainy Studio Ambience', freq: 528 },
    { title: 'Zen Meditation Bell', freq: 639 },
  ];

  // Web Audio API Synth for royalty-free atmospheric sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      if (gainRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current?.currentTime || 0 + 0.5
        );
      }
      setTimeout(() => {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        setIsPlaying(false);
      }, 500);
    } else {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(tracks[trackIndex].freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlaying(true);
    }
  };

  if (themeMode !== 'ambient') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] bg-black/80 backdrop-blur-md text-amber-200 border border-amber-500/30 p-2.5 px-4 rounded-full shadow-2xl flex items-center space-x-3 text-xs font-mono">
      <div className="flex items-center space-x-2">
        <Disc className={`w-4 h-4 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
        <span className="font-bold tracking-wider">{tracks[trackIndex].title}</span>
      </div>

      <button
        onClick={togglePlay}
        className="p-1.5 bg-amber-500/20 hover:bg-amber-500 hover:text-black rounded-full transition-all cursor-pointer"
        title="앰비언트 음악 재생/정지"
      >
        {isPlaying ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-amber-500" />}
      </button>

      <button
        onClick={() => {
          setTrackIndex((prev) => (prev + 1) % tracks.length);
          if (isPlaying) {
            togglePlay();
            setTimeout(togglePlay, 300);
          }
        }}
        className="p-1 text-amber-400/60 hover:text-amber-300 text-[10px] uppercase font-bold cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Howl } from 'howler';
import { useOfficeStore } from '@/lib/store/useOfficeStore';
import { MUSIC_TRACKS } from '@/lib/music-tracks';
import {
  ListMusic,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { isPlayingMusic, setMusicPlaying, musicVolume, setMusicVolume } = useOfficeStore();

  const [trackIndex, setTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bars, setBars] = useState([40, 70, 30, 90, 60, 45, 80]);

  const howlRef = useRef<Howl | null>(null);
  // Refs let the howl callbacks read the latest values without rebuilding the sound.
  const playingRef = useRef(isPlayingMusic);
  const mutedRef = useRef(isMuted);
  const volumeRef = useRef(musicVolume);

  const track = MUSIC_TRACKS[trackIndex];

  useEffect(() => {
    playingRef.current = isPlayingMusic;
  }, [isPlayingMusic]);

  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    volumeRef.current = musicVolume;
  }, [musicVolume]);

  // Load the current track. Howler is imported lazily so it never runs during SSR.
  useEffect(() => {
    let cancelled = false;
    let howl: Howl | null = null;

    setIsLoading(true);
    setHasError(false);
    setProgress(0);

    import('howler')
      .then(({ Howl }) => {
        if (cancelled) return;

        howl = new Howl({
          src: [track.src],
          html5: true,
          loop: false,
          volume: 0,
          onload: () => {
            if (cancelled || !howl) return;
            setIsLoading(false);
            howl.volume(mutedRef.current ? 0 : volumeRef.current);
            if (playingRef.current) howl.play();
          },
          onplay: () => {
            if (cancelled) return;
            setIsLoading(false);
            setHasError(false);
          },
          onloaderror: () => {
            if (cancelled) return;
            setIsLoading(false);
            setHasError(true);
            setMusicPlaying(false);
          },
          onplayerror: () => {
            // Browsers may block playback until the next user gesture.
            if (cancelled || !howl) return;
            howl.once('unlock', () => howl?.play());
          },
          // Playlist loops: when a track ends, move on to the next one.
          onend: () => {
            if (cancelled) return;
            setTrackIndex((index) => (index + 1) % MUSIC_TRACKS.length);
          },
        });

        howlRef.current = howl;
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoading(false);
        setHasError(true);
      });

    return () => {
      cancelled = true;
      howl?.unload();
      howlRef.current = null;
    };
  }, [trackIndex, setMusicPlaying]);

  // Keep the sound in sync with the play/pause state.
  useEffect(() => {
    const howl = howlRef.current;
    if (!howl) return;
    if (isPlayingMusic) {
      if (!howl.playing()) howl.play();
    } else {
      howl.pause();
    }
  }, [isPlayingMusic]);

  // Volume / mute.
  useEffect(() => {
    howlRef.current?.volume(isMuted ? 0 : musicVolume);
  }, [musicVolume, isMuted, trackIndex]);

  // Progress bar + equalizer animation while playing.
  useEffect(() => {
    if (!isPlayingMusic) return;

    const progressTimer = setInterval(() => {
      const howl = howlRef.current;
      if (!howl) return;
      const duration = howl.duration();
      const position = howl.seek();
      setProgress(
        duration > 0 && typeof position === 'number' ? Math.min(position / duration, 1) : 0
      );
    }, 500);

    const barsTimer = setInterval(() => {
      setBars([
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 70) + 30,
        Math.floor(Math.random() * 85) + 15,
        Math.floor(Math.random() * 75) + 25,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 95) + 10,
      ]);
    }, 150);

    return () => {
      clearInterval(progressTimer);
      clearInterval(barsTimer);
    };
  }, [isPlayingMusic]);

  const togglePlayback = () => {
    const howl = howlRef.current;
    const next = !isPlayingMusic;
    setMusicPlaying(next);
    if (!howl) return;
    if (next) howl.play();
    else howl.pause();
  };

  const changeTrack = (step: number) => {
    setTrackIndex(
      (index) => (index + step + MUSIC_TRACKS.length) % MUSIC_TRACKS.length
    );
    setMusicPlaying(true);
  };

  const selectTrack = (index: number) => {
    setShowPlaylist(false);
    setMusicPlaying(true);
    if (index === trackIndex) {
      howlRef.current?.play();
      return;
    }
    setTrackIndex(index);
  };

  const seekTo = (event: React.MouseEvent<HTMLDivElement>) => {
    const howl = howlRef.current;
    if (!howl) return;
    const duration = howl.duration();
    if (!duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    howl.seek(duration * ratio);
    setProgress(ratio);
  };

  const statusText = hasError
    ? 'audio unavailable'
    : isLoading
      ? 'loading…'
      : track.subtitle;

  return (
    <div className="absolute bottom-4 right-4 z-30 font-mono text-xs select-none">
      {/* Playlist popover */}
      {showPlaylist && (
        <div className="mb-2 w-60 rounded border border-[#2e3458] bg-[#1b1b2f]/95 p-1 shadow-2xl backdrop-blur">
          <p className="px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-slate-500">
            Playlist
          </p>
          {MUSIC_TRACKS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => selectTrack(index)}
              className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left transition ${
                index === trackIndex
                  ? 'bg-indigo-600/20 text-white'
                  : 'text-slate-300 hover:bg-[#2e3458]'
              }`}
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[11px] font-bold">{item.title}</span>
                <span className="truncate text-[9px] text-slate-500">{item.subtitle}</span>
              </span>
              {index === trackIndex && isPlayingMusic && (
                <span className="shrink-0 text-[9px] text-indigo-300">PLAYING</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="bg-[#1b1b2f]/90 border border-[#2e3458] rounded p-2 flex items-center gap-2 shadow-2xl backdrop-blur">
        {/* Previous */}
        <button
          onClick={() => changeTrack(-1)}
          className="p-1 text-slate-400 hover:text-slate-200 transition"
          title="Previous track"
        >
          <SkipBack size={13} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlayback}
          className="p-1.5 bg-[#2e3458] hover:bg-indigo-600 text-slate-200 rounded transition"
          title={isPlayingMusic ? 'Pause lo-fi' : 'Play lo-fi'}
        >
          {isPlayingMusic ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Next */}
        <button
          onClick={() => changeTrack(1)}
          className="p-1 text-slate-400 hover:text-slate-200 transition"
          title="Next track"
        >
          <SkipForward size={13} />
        </button>

        {/* Track info + progress */}
        <div className="flex min-w-[112px] max-w-[150px] flex-col">
          <span className="truncate text-slate-200 font-bold">{track.title}</span>
          <span
            className={`truncate text-[9px] ${hasError ? 'text-red-400' : 'text-slate-400'}`}
          >
            {statusText}
          </span>
          <div
            onClick={seekTo}
            role="progressbar"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            className="mt-1 h-[3px] w-full cursor-pointer rounded bg-black/60"
          >
            <div
              className="h-full rounded bg-indigo-500 transition-[width] duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        {/* Equalizer */}
        <div className="hidden items-end gap-0.5 h-5 px-1 sm:flex">
          {bars.map((height, index) => (
            <div
              key={index}
              className={`w-1 rounded-t transition-all duration-150 ${
                isPlayingMusic ? 'bg-indigo-400' : 'bg-slate-600'
              }`}
              style={{ height: isPlayingMusic ? `${height}%` : '20%' }}
            />
          ))}
        </div>

        {/* Volume */}
        <div className="hidden items-center gap-1 sm:flex">
          <button
            onClick={() => setIsMuted((muted) => !muted)}
            className="p-1 text-slate-400 hover:text-slate-200 transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={musicVolume}
            onChange={(event) => setMusicVolume(Number(event.target.value))}
            className="h-1 w-14 accent-indigo-500 cursor-pointer"
            aria-label="Volume"
          />
        </div>

        {/* Playlist toggle */}
        <button
          onClick={() => setShowPlaylist((open) => !open)}
          className={`p-1 transition ${
            showPlaylist ? 'text-indigo-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Playlist"
        >
          <ListMusic size={14} />
        </button>
      </div>
    </div>
  );
};

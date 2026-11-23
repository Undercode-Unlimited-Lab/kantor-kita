export interface MusicTrack {
  id: string;
  title: string;
  /** Short descriptor shown under the title. */
  subtitle: string;
  /** Path served from /public. */
  src: string;
  bpm: number;
}

/**
 * Original loops generated for Kantor-Kita (no third-party audio).
 * Keep the files in /public/audio and the paths below in sync.
 */
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'chrome-commons',
    title: 'Chrome Commons',
    subtitle: 'Town · F# mixolydian · 78 BPM',
    src: '/audio/chrome-commons.mp3',
    bpm: 78,
  },
  {
    id: 'night-shift',
    title: 'Night Shift',
    subtitle: 'Office · A minor · 70 BPM',
    src: '/audio/night-shift.mp3',
    bpm: 70,
  },
  {
    id: 'pixel-rain',
    title: 'Pixel Rain',
    subtitle: 'Lounge · D dorian · 84 BPM',
    src: '/audio/pixel-rain.mp3',
    bpm: 84,
  },
];

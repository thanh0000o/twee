import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { tracks } from '../music/tracks';

type MusicPlayerProps = {
  highlight: string;
};

const timeLabel = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

export function MusicPlayer({ highlight }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeOnChange = useRef(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [error, setError] = useState('');
  const track = tracks[trackIndex];

  useEffect(() => {
    if (!resumeOnChange.current) return;
    resumeOnChange.current = false;
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      setError('this track could not be played.');
    });
  }, [trackIndex]);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError('');
    void audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      setError('this track could not be played.');
    });
  };

  const chooseTrack = (index: number, startPlaying: boolean) => {
    if (index === trackIndex) {
      if (startPlaying && !playing) play();
      return;
    }
    resumeOnChange.current = startPlaying;
    setPlaying(false);
    setPosition(0);
    setDuration(0);
    setError('');
    setTrackIndex(index);
  };

  return (
    <section
      className="music-player"
      aria-label="music player"
      style={{ '--music-accent': highlight } as CSSProperties}
    >
      <div className="music-deck">
        <div className="music-heading">
          <span className="music-name" aria-live="polite">
            <span className="music-led" aria-hidden="true" />
            sound: {track.artist} — {track.title}
          </span>
          <button
            className="music-text-button"
            type="button"
            onClick={() => setPlaylistOpen((open) => !open)}
            aria-controls="music-playlist"
            aria-expanded={playlistOpen}
          >
            {playlistOpen ? '{close}' : `{tracks: ${tracks.length}}`}
          </button>
        </div>
        <div className="music-transport">
          <button type="button" onClick={() => chooseTrack((trackIndex - 1 + tracks.length) % tracks.length, playing)} aria-label="previous track">◀◀</button>
          <button
            type="button"
            className="music-play"
            onClick={() => {
              if (playing) {
                audioRef.current?.pause();
                setPlaying(false);
              } else {
                play();
              }
            }}
            aria-label={playing ? 'pause' : 'play'}
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>
          <button type="button" onClick={() => chooseTrack((trackIndex + 1) % tracks.length, playing)} aria-label="next track">▶▶</button>
          <span className="music-time">{timeLabel(position)}</span>
          <input
            aria-label="seek through track"
            type="range"
            min={0}
            max={duration || 1}
            step={1}
            value={Math.min(position, duration || 1)}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
                audioRef.current.currentTime = next;
                setPosition(next);
              }
            }}
            style={{ '--music-progress': `${duration ? (position / duration) * 100 : 0}%` } as CSSProperties}
          />
          <span className="music-time">{timeLabel(duration)}</span>
        </div>
      </div>
      {error && <p className="music-error" role="alert">{error}</p>}
      {playlistOpen && (
        <div className="music-playlist" id="music-playlist">
          <div className="music-playlist-title">{track.album} / {tracks.length} tracks</div>
          <ol>
            {tracks.map((item, index) => (
              <li key={item.src}>
                <button
                  type="button"
                  className={index === trackIndex ? 'selected' : ''}
                  onClick={() => chooseTrack(index, true)}
                  aria-current={index === trackIndex ? 'true' : undefined}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{item.title}</span>
                  <span>{index === trackIndex && playing ? '♪' : '·'}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
      <audio
        key={track.src}
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
        onEnded={() => {
          setPlaying(false);
          if (trackIndex < tracks.length - 1) chooseTrack(trackIndex + 1, true);
        }}
        onError={() => {
          setPlaying(false);
          setError('this track could not be loaded.');
        }}
      />
    </section>
  );
}
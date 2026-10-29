import { type FC, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { BlogReturnLink } from '../components/blog-return-link';
import { getSavedPaletteFilter } from '../palette';

import img1 from '@/assets/artwork/01.jpg';
import img2 from '@/assets/artwork/02.jpg';
import img3 from '@/assets/artwork/03.jpg';
import img4 from '@/assets/artwork/04.jpg';
import img5 from '@/assets/artwork/05.jpg';
import img6 from '@/assets/artwork/06.jpg';
import img7 from '@/assets/artwork/07.jpg';
import img8 from '@/assets/artwork/08.jpg';
import img9 from '@/assets/artwork/09.jpg';
import img10 from '@/assets/artwork/10.jpg';
import img11 from '@/assets/artwork/11.jpg';
import img12 from '@/assets/artwork/12.jpg';
import img13 from '@/assets/artwork/13.jpg';
import img14 from '@/assets/artwork/14.jpg';
import img15 from '@/assets/artwork/15.jpg';
import img16 from '@/assets/artwork/16.jpg';
import img17 from '@/assets/artwork/17.jpg';
import img18 from '@/assets/artwork/18.jpg';
import img19 from '@/assets/artwork/19.jpg';
import img20 from '@/assets/artwork/20.jpg';
import img21 from '@/assets/artwork/21.jpg';
import img22 from '@/assets/artwork/22.jpg';
import img23 from '@/assets/artwork/23.jpg';
import img24 from '@/assets/artwork/24.jpg';
import img25 from '@/assets/artwork/25.jpg';
import img26 from '@/assets/artwork/26.jpg';
import img27 from '@/assets/artwork/27.jpg';
import img28 from '@/assets/artwork/28.jpg';
import img29 from '@/assets/artwork/29.jpg';
import img30 from '@/assets/artwork/30.jpg';
import img31 from '@/assets/artwork/31.jpg';
import img32 from '@/assets/artwork/32.jpg';
import img33 from '@/assets/artwork/33.jpg';
import img34 from '@/assets/artwork/34.jpg';
import img35 from '@/assets/artwork/35.jpg';
import img36 from '@/assets/artwork/36.jpg';
import img37 from '@/assets/artwork/37.jpg';
import img38 from '@/assets/artwork/38.jpg';
import img39 from '@/assets/artwork/39.jpg';
import img40 from '@/assets/artwork/40.jpg';
import img41 from '@/assets/artwork/41.jpg';
import img42 from '@/assets/artwork/42.jpg';
import img43 from '@/assets/artwork/43.jpg';
import img44 from '@/assets/artwork/44.jpg';
import img45 from '@/assets/artwork/45.jpg';
import img46 from '@/assets/artwork/46.jpg';
import img47 from '@/assets/artwork/47.jpg';
import img48 from '@/assets/artwork/48.jpg';
import img49 from '@/assets/artwork/49.jpg';
import img50 from '@/assets/artwork/50.jpg';
import img51 from '@/assets/artwork/51.jpg';
import img52 from '@/assets/artwork/52.jpg';
import img53 from '@/assets/artwork/53.jpg';
import img54 from '@/assets/artwork/54.jpg';
import img55 from '@/assets/artwork/55.jpg';
import img56 from '@/assets/artwork/56.jpg';
import img57 from '@/assets/artwork/57.jpg';
import img58 from '@/assets/artwork/58.jpg';
import img59 from '@/assets/artwork/59.jpg';
import img60 from '@/assets/artwork/60.jpg';
import img61 from '@/assets/artwork/61.jpg';
import img62 from '@/assets/artwork/62.jpg';
import img63 from '@/assets/artwork/63.jpg';
import img64 from '@/assets/artwork/64.jpg';
import img65 from '@/assets/artwork/65.jpg';
import img66 from '@/assets/artwork/66.jpg';
import img67 from '@/assets/artwork/67.jpg';
import img68 from '@/assets/artwork/68.jpg';
import img69 from '@/assets/artwork/69.jpg';
import img70 from '@/assets/artwork/70.jpg';
import img71 from '@/assets/artwork/71.jpg';
import img72 from '@/assets/artwork/72.jpg';
import img73 from '@/assets/artwork/73.jpg';
import img74 from '@/assets/artwork/74.jpg';
import img75 from '@/assets/artwork/75.jpg';
import img76 from '@/assets/artwork/76.jpg';
import video1 from '@/assets/artwork/videos/01.mp4';
import video2 from '@/assets/artwork/videos/02.mp4';
import video3 from '@/assets/artwork/videos/03.mp4';
import video4 from '@/assets/artwork/videos/04.mp4';
import video5 from '@/assets/artwork/videos/05.mp4';
import video6 from '@/assets/artwork/videos/06.mp4';
import video7 from '@/assets/artwork/videos/07.mp4';
import video8 from '@/assets/artwork/videos/08.mp4';
import video9 from '@/assets/artwork/videos/09.mp4';

const sourceArtwork = [
  img1, img2, img3, img4, img5, img6, img7, img8,
  img9, img10, img11, img12, img13, img14, img15, img16,
  img17, img18, img19, img20, img21, img22, img23, img24,
  img25, img26, img27, img28, img29, img30, img31, img32,
  img33, img34, img35, img36,
  img37, img38, img39, img40, img41, img42, img43, img44,
  img45, img46, img47, img48, img49, img50, img51, img52,
  img53, img54, img55, img56,
  img57, img58, img59, img60, img61, img62, img63, img64,
  img65, img66, img67, img68, img69, img70, img71, img72,
  img73, img74, img75,
];

const featuredArtwork = [
  img8, img12, img4, img5,
  img14, img10, img13, img9, img2, img7,
];
const featuredSet = new Set(featuredArtwork);

const shuffledArtwork = sourceArtwork
  .filter((src) => !featuredSet.has(src))
  .map((src, index) => ({
    src,
    order: ((index + 17) * 47) % 71,
  }))
  .sort((a, b) => a.order - b.order)
  .map(({ src }) => src);

const videoArtwork = [
  video1, video2, video3, video4, video5,
  video6, video7, video8, video9,
];

const mixedArtwork = [...shuffledArtwork, ...videoArtwork]
  .map((src, index) => ({
    src,
    order: ((index + 29) * 53) % 149,
  }))
  .sort((a, b) => a.order - b.order)
  .map(({ src }) => src);

// Exclude these three pieces from both the gallery and its image viewer.
const removedArtwork = new Set([img9, img56, img69]);
const topArtwork = [img76, img6, video1, video7, img15, video2, img16, video5, video4];
const topArtworkSet = new Set(topArtwork);
const allArtwork = [
  ...topArtwork,
  ...[...featuredArtwork, ...mixedArtwork].filter(
    (src) => !removedArtwork.has(src) && !topArtworkSet.has(src),
  ),
];
const VIDEO_ARTWORK = new Set(videoArtwork);

const CHUNK_SIZE = 10;
const chunks: string[][] = [];
for (let i = 0; i < allArtwork.length; i += CHUNK_SIZE) {
  chunks.push(allArtwork.slice(i, i + CHUNK_SIZE));
}

const SCATTER = [
  { x: -18, r: -0.7 },
  { x: 12, r: 0.4 },
  { x: -8, r: -0.25 },
  { x: 20, r: 0.6 },
  { x: -14, r: -0.45 },
  { x: 16, r: 0.35 },
  { x: -22, r: -0.6 },
  { x: 7, r: 0.3 },
  { x: -5, r: -0.2 },
  { x: 21, r: 0.5 },
];

const LANDSCAPE_ARTWORK = new Set([
  img3, img5, img6, img15,
  img17, img19, img21, img23, img25, img27, img29, img31, img33, img35, img36,
  img44,
  video1, video2, video3, video4, video5, video6, video7, video8,
]);

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

const ArtworkVideoPlayer: FC<{ src: string; index: number }> = ({ src, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="artwork-video-player">
      <div className="artwork-video-title">{`{video artwork ${String(index + 1).padStart(2, '0')}}`}</div>
      <video
        ref={videoRef}
        src={src}
        className="viz-lightbox-image viz-lightbox-video"
        autoPlay
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        aria-label={`Video artwork ${index + 1}`}
      />
      <div className="artwork-video-controls">
        <button
          type="button"
          className="artwork-video-play"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? 'Ⅱ' : '▶'}
        </button>
        <span className="artwork-video-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          className="artwork-video-progress"
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => {
            const nextTime = Number(event.target.value);
            if (videoRef.current) videoRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
          }}
          aria-label="Video progress"
        />
      </div>
    </div>
  );
};

export const Artwork: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'artwork — thanh lambeets';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex]);

  return (
    <main className="viz-page artwork-page relative !p-0">
      <nav className="subpage-return-links subpage-return-links--fixed" aria-label="Return navigation">
        <Link href="/" className="viz-return subpage-return" style={{ filter: getSavedPaletteFilter() }}>
          <span>{`{return home}`}</span>
        </Link>
        <BlogReturnLink />
      </nav>
      <h1 className="viz-page-title">{`{artwork}`}</h1>

      <div className="viz-gallery">
        {chunks.map((chunk, chunkIndex) => (
          <section
            className="viz-grid-section"
            id={`artwork-section-${chunkIndex + 1}`}
            key={chunkIndex}
          >
            {chunk.map((src, itemIndex) => {
              const absoluteIndex = chunkIndex * CHUNK_SIZE + itemIndex;
              const scatter = SCATTER[(itemIndex + chunkIndex * 3) % SCATTER.length];

              return (
                <div className="viz-scatter-cell" key={src}>
                  <button
                    type="button"
                    className={`viz-item-container ${LANDSCAPE_ARTWORK.has(src) ? 'is-landscape' : ''}`}
                    onClick={() => setActiveIndex(absoluteIndex)}
                    aria-label={`Open artwork ${absoluteIndex + 1}`}
                    style={{
                      '--scatter-x': `${scatter.x}px`,
                      '--scatter-r': `${scatter.r}deg`,
                    } as React.CSSProperties}
                  >
                    <div className="viz-plate" aria-hidden="true" />
                    {VIDEO_ARTWORK.has(src) ? (
                      <video
                        src={src}
                        className="viz-img viz-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={`Video artwork ${absoluteIndex + 1}`}
                      />
                    ) : (
                      <img
                        src={src}
                        alt={`Artwork ${absoluteIndex + 1}`}
                        className="viz-img"
                        loading={absoluteIndex > 9 ? 'lazy' : 'eager'}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </section>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="viz-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Artwork ${activeIndex + 1} of ${allArtwork.length}`}
          onClick={() => setActiveIndex(null)}
        >
          <div className="viz-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            {VIDEO_ARTWORK.has(allArtwork[activeIndex]) ? (
              <ArtworkVideoPlayer
                src={allArtwork[activeIndex]}
                index={activeIndex}
              />
            ) : (
              <img
                src={allArtwork[activeIndex]}
                alt={`Artwork ${activeIndex + 1}`}
                className="viz-lightbox-image"
              />
            )}
            <button
              type="button"
              className="viz-lightbox-close"
              autoFocus
              onClick={() => setActiveIndex(null)}
            >
              {`{close}`}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
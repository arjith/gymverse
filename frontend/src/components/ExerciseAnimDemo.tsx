import { useState, useEffect, useRef } from 'react';
import './ExerciseAnimDemo.scss';

interface Props {
  images: string[];
  alt: string;
  autoPlay?: boolean;
}

export default function ExerciseAnimDemo({ images, alt, autoPlay = false }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovering, setHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const shouldAnimate = autoPlay || hovering;

  useEffect(() => {
    clearInterval(timerRef.current);
    if (shouldAnimate && images.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveIdx((p) => (p + 1) % images.length);
      }, 1200);
    } else {
      setActiveIdx(0);
    }
    return () => clearInterval(timerRef.current);
  }, [shouldAnimate, images.length]);

  if (!images.length) return null;

  return (
    <div
      className={`anim-demo ${autoPlay ? 'anim-demo--auto' : ''}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`${alt} – position ${i + 1}`}
          className={`anim-demo__img ${i === activeIdx ? 'anim-demo__img--active' : ''}`}
          loading="lazy"
        />
      ))}
      {images.length > 1 && (
        <>
          <div className="anim-demo__dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`anim-demo__dot ${i === activeIdx ? 'anim-demo__dot--active' : ''}`}
              />
            ))}
          </div>
          {shouldAnimate && (
            <span className="anim-demo__label">
              {activeIdx === 0 ? 'Start' : 'End'}
            </span>
          )}
        </>
      )}
    </div>
  );
}

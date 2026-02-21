import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface Props {
  images: string[];
  exerciseName: string;
  muscleGroup: string;
}

export const ExerciseMotionComp: React.FC<Props> = ({ images, exerciseName, muscleGroup }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (images.length === 0) return null;

  // Single image → subtle breathing zoom
  if (images.length === 1) {
    const scale = interpolate(frame, [0, durationInFrames], [1, 1.06], {
      extrapolateRight: 'clamp',
    });
    return (
      <AbsoluteFill style={{ background: '#050505' }}>
        <Img
          src={images[0]}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
          }}
        />
        <Overlay name={exerciseName} group={muscleGroup} />
      </AbsoluteFill>
    );
  }

  // Two+ images → crossfade with Ken Burns
  const mid = Math.floor(durationInFrames / 2);

  // Image 1: visible frames 0 → mid, Ken Burns zoom in
  const img1Opacity = interpolate(frame, [mid - 10, mid + 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const img1Scale = interpolate(frame, [0, mid], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });

  // Image 2: visible frames mid → end, Ken Burns zoom out
  const img2Opacity = interpolate(frame, [mid - 10, mid + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const img2Scale = interpolate(frame, [mid, durationInFrames], [1.08, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Position label
  const isStart = frame < mid;
  const labelOpacity = interpolate(
    frame,
    [0, 8, mid - 5, mid + 5, mid + 10, durationInFrames - 5],
    [0, 1, 1, 0, 1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: '#050505' }}>
      <Img
        src={images[0]}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: img1Opacity,
          transform: `scale(${img1Scale})`,
        }}
      />
      <Img
        src={images[1]}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: img2Opacity,
          transform: `scale(${img2Scale})`,
        }}
      />

      {/* Position label */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: isStart ? 'rgba(158,253,56,0.85)' : 'rgba(201,169,110,0.85)',
          color: '#050505',
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          opacity: labelOpacity,
        }}
      >
        {isStart ? 'Start' : 'End'}
      </div>

      <Overlay name={exerciseName} group={muscleGroup} />
    </AbsoluteFill>
  );
};

function Overlay({ name, group }: { name: string; group: string }) {
  return (
    <>
      {/* Bottom gradient vignette */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(transparent, rgba(5,5,5,0.85))',
          pointerEvents: 'none',
        }}
      />
      {/* Exercise name + muscle */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 10,
          right: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <span
          style={{
            color: '#f0f0f0',
            fontSize: 12,
            fontWeight: 700,
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            maxWidth: '70%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
        <span
          style={{
            color: '#9EFD38',
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {group}
        </span>
      </div>
    </>
  );
}

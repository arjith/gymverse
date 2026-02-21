import { Player } from '@remotion/player';
import { ExerciseMotionComp } from './remotion/ExerciseMotionComp';

interface Props {
  images: string[];
  exerciseName: string;
  muscleGroup: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { width: 88, height: 66 },
  md: { width: 280, height: 200 },
  lg: { width: 560, height: 400 },
};

export default function ExercisePlayer({ images, exerciseName, muscleGroup, size = 'md' }: Props) {
  if (!images || images.length === 0) return null;

  const dims = sizeMap[size];

  const interactive = size === 'lg';

  return (
    <div style={{
      borderRadius: size === 'sm' ? 6 : 10,
      overflow: 'hidden',
      lineHeight: 0,
      pointerEvents: interactive ? 'auto' : 'none',
    }}>
      <Player
        component={ExerciseMotionComp}
        inputProps={{ images, exerciseName, muscleGroup }}
        durationInFrames={90}
        fps={30}
        compositionWidth={dims.width}
        compositionHeight={dims.height}
        style={{ width: '100%', height: 'auto', aspectRatio: `${dims.width}/${dims.height}` }}
        loop
        autoPlay
        controls={interactive}
        clickToPlay={interactive}
        showVolumeControls={false}
      />
    </div>
  );
}

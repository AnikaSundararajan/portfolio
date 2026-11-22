import { Clouds } from './layers/Clouds'
import { DistantPeaks } from './layers/DistantPeaks'
import { ForegroundTrees } from './layers/ForegroundTrees'
import { Meadow } from './layers/Meadow'
import { MidRidges } from './layers/MidRidges'
import { PineForest } from './layers/PineForest'
import { RockFace } from './layers/RockFace'
import { Sky } from './layers/Sky'
import { Snowcap } from './layers/Snowcap'
import { Sun } from './layers/Sun'
import { Trail } from './layers/Trail'

/**
 * Paper-cut layers, back to front. Sky/sun/clouds sit outside the camera;
 * everything else is inside it so the intro zoom moves the whole landscape.
 */
export function Scene({ markers }: { markers: { key: string; progress: number }[] }) {
  return (
    <div className="scene" aria-hidden="true">
      <Sky />
      <Sun />
      <Clouds />
      <div className="camera">
        <DistantPeaks />
        <MidRidges />
        <div className="world">
          <Snowcap />
          <RockFace />
          <Meadow />
          <PineForest />
          <Trail markers={markers} />
        </div>
        <ForegroundTrees />
      </div>
    </div>
  )
}

import { TargetProfile } from '../Profile'
import { P2004 } from './P2.0.0'
import { P3000 } from './P3.0.0'

const Profiles: Record<string, TargetProfile> = {
  "2.0.4": P2004,
  "3.0": P3000,
  latest: P3000
}

export default Profiles
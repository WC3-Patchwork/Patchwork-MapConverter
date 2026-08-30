import { readFile } from 'fs/promises'
import { type TargetProfile } from './Profile'
import Profiles from './profiles'

export const ProfileLoader = {
  async LoadTargetProfile(profileKey: string): Promise<TargetProfile> {
    let profile: TargetProfile
    if (Profiles[profileKey] != null) {
      profile = Profiles[profileKey] as TargetProfile
    } else {
      profile = JSON.parse(await readFile(profileKey, { flag: 'r', encoding: 'utf-8' })) as TargetProfile
    }

    return profile
  }
}
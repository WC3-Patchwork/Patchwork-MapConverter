import { readFile } from 'fs/promises'
import { type TargetProfile } from './Profile'
import { existsSync } from 'fs'

async function LoadTargetProfile (profileKey: string): Promise<TargetProfile> {
  const internalProfileName = `targets/profile.${profileKey}.json`
  let profileContent: string
  if (existsSync(internalProfileName)) {
    profileContent = await readFile(internalProfileName, { flag: 'r', encoding: 'utf-8' })
  } else {
    profileContent = await readFile(profileKey, { flag: 'r', encoding: 'utf-8' })
  }

  return JSON.parse(profileContent) as TargetProfile
}

export { LoadTargetProfile }

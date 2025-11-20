import { type integer } from '../wc3maptranslator/CommonInterfaces'

interface TargetProfile {
  editorVersion: integer
  impFormatVersion: integer
  wtgFormatVersion: integer
  wtgFormatSubversion: integer
  wctFormatVersion: integer
  w3iFormatVersion: integer
  objectFormatVersion: integer
  w3eFormatVersion: integer
  unitsDooFormatVersion: integer
  unitsDooFormatSubversion: integer
  dooFormatVersion: integer
  dooFormatSubversion: integer | undefined
  specialDooFormatVersion: integer | undefined
  w3rFormatVersion: integer
  w3cFormatVersion: integer
  w3sFormatVersion: integer
}
export type { TargetProfile }
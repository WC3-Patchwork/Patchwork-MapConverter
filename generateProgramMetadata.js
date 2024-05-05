import pkg from './package.json' assert { type: "json" };

console.log(`export const NAME = '${pkg.name}'
export const DESCRIPTION = '${pkg.description}'
export const DISPLAY_NAME = '${pkg.displayName}'
export const VERSION = '${pkg.version}'
export const AUTHOR = '${pkg.author}'
export const LICENSE = '${pkg.license}'`)

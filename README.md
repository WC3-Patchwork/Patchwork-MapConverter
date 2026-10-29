# Patchwork-MapConverter
Executable wrapper for https://github.com/ChiefOfGxBxL/WC3MapTranslator

## Target profiles
`json2war` takes a target profile: a game patch (`1.00` to `1.31`, `1.32.0` to `1.32.10`, `1.33` to `1.36`, `2.0.0` to `2.0.4`, `3.0.0`, `3.0.1`; `1.32`, `2.0`, `3.0` and `latest` are the newest of each) or the path of a profile JSON, which `war2json --generate-target-profile` writes from a map.
What each patch's World Editor writes into each map file, and what each patch's game data (SLK) has, is in [docs/game-versions.md](docs/game-versions.md).
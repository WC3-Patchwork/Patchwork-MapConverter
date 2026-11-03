# Patchwork-MapConverter

Patchwork-MapConverter is a Node.js console application that allows you to convert Warcraft III Map binaries found inside the map's MPQ archive, into textual representation, and back to same binary format the game uses.

It offers two subcommands; `war2text` and `text2war`.

## war2text

`patchwork-mapconverter war2text [options] <input> <output> [target]` subcommand, as the name suggests, is used to convert map's binary files into textual files. 

Argument `input` is expected to be a filepath that leads to a **folder** which contains all of the map's files. Mandatory.

Argument `output` is expected to be a filepath that leads to a **folder** where the program will export all of the converted textual files to. Mandatory.

Argument `target` is supposed to be either a one of the keywords representing which game version you're converting from or a filepath to a custom profile file. Used in case the folder does not contain `war3map.w3i` file, which contains `editorVersion` which is crucial for converting some other files. Optional, but will throw an exception if lacking but requiring this information. Available profiles are listed further below.

Here are the following options for `war2text` subcommand:
- `--ignore <blacklist>` - Specifies path to a file that contains a list of files that should be ignored, using `.gitignore`-like logic.
- `-p, --prettify` - Output textual format will be prettified if the format converter supports it.
- `--si, --smart-imports` - Unpacks imports into a separate folder using `war3map.imp` as a reference.
- `--imp, --imports-folder-name <importsFolderName>` - Valid only if `--si` is used. Specified folder name where imports will be placed in.
- `--mde, --map-data-extension <extension>` - File extension to which textual format will various map binary files be converted to; Valid extensions are `.json`, `.toml`, `.yaml` and `.yml`.
- `--td, --trigger-data <triggerData>` - Specifies a path to a file that contains a `triggerdata.txt` which the map's GUI triggers use to reference how many parameters each event/condition/action/call has. Required if converting GUI triggers.
- `--tf, --triggers-filename <filename>` - Invalid if `--ct` option is specified. Used to declare the filename of triggers file which is a combination of `war3map.wtg` and `war3map.wct` files. File extension is determined by `--mde` option.
- `--ct, --compose-triggers` - Unpacks triggers into folders and files instead of a single textual file.
- `--sf, --source-folder <sourceFolder>` - Valid if `--ct` option is used. Specifies the folder in which all the map's triggers and scripts will be exported into.
- `--cse, --custom-script-extension <extension>` - Valid if `--ct` option is used. Specifies the extension to which custom scripts will be exported as, any extension works as long as the argument starts with a dot. E.g: `.j`.
- `--dis, --disabled-extension <extension>` - Valid if `--ct` option is used. Specifies the extension to which custom scripts will be exported as when disabled. Appends to whatever was specified with `--cse`. E.g: `--cse .j --dis .d` results in `file.j.d`.
- `--ge, --gui-extension <extension>` - Valid if `--ct` option is used. Specifies the extension to which GUI triggers and variables will be exported as. Valid extensions are: `.json`, `.toml`, `.yaml` and `.yml`.
- `--cie, --container-info-extension <extension>` - Valid if `--ct` option is used. Specifies the extension to which trigger categories' metadata will be written to. Any extension works as long as it starts with a dot. The format it writes into is exclusively `.ini`.
- `--ce, --comment-extension <extension>` - Valid if `--ct` option is used. Specifies the extension to which trigger comments will be exported to. Any extension works as long as it starts with a dot. It always writes it as a simple text, not a data structure.
- `--mh, --map-header <filename>` - Valid if `--ct` option is used. Specifies the filename of the map's header script.
- `--chunk, --chunkify` - Aggregates terrain, preplaced objects, and region data into multiple chunk files.
- `--ctf, --chunkified-terrain-folder <folderName>` - Valid only if `--chunk` option is specified. Defines what the folder inside `output` will contain terrain chunks.
- `--cfe, --chunk-file-extension <extension>` - Valid only if `--chunk` option is specified. What file extension will these chunk files have; Valid extensions are `.json`, `.toml`, `.yml` and `.yaml`.

- `--cs, --chunk-size <sizeX,sizeY,offsetX,offsetY>` - Valid only if `--chunk` option is specified. Defines the size of terrain chunks it will split the map terrain into. Size parameters refer to how many 4x4 tiles fit in a single chunk. Offset arguments are for fine-tuning the grid positioning and operate on single tiles.
- `--rs, --resolve-strings` - Dereference `TRIGSTR_XXX` into strings found in `war3map.wts` and removes them from the converted `war3map.wts` textual form. Leaving only excess strings in there, that may be found in some other file that Patchwork doesn't process, or strings that are not used anywhere. Does not work for scripts and triggers.
- `--frs, --force-resolve-strings` - Does what `--rs` option does but also applies it to scripts and triggers. **Warning: Converting triggers with dereferenced strings may cause the editor to crash while loading the map, proceed with caution.**
- `--gtp, --generate-target-profile <profileOutputPath>` - Generate target profile.json file, which contains all binary format versions that were found in the files that it was converting. Useful for converting these files back to binary, in case you don't know which game version this map is made for, or it uses some specific combination of map file formats for some reason. `profileOutputPath` is a path where it will generate this file in. This generated file can then be used in text2war subcommand.

## text2war
`patchwork-mapconverter text2war [options] <input> <output> <target>` subcommand, as the name suggests, is used to convert textual files into map's binary files. 

Argument `input` is expected to be a filepath that leads to a **folder** which textual files that will be converted into map's binary files. Mandatory.

Argument `output` is expected to be a filepath that leads to a **folder** where the program will export all of the binary files to. Mandatory.

Argument `target` is supposed to be either a one of the keywords representing which game version you're converting to, or a filepath to a custom profile file. Required. Available profiles are listed further below.

Here are the following options for `text2war` subcommand:
- `--ignore <blacklist>` - Specifies path to a file that contains a list of files that should be ignored, using `.gitignore`-like logic.
- `--si, --smart-imports` - Recompiles `war3map.imp` using the `--imp` option's folder as reference, while moving the imported files to the right spot in the output map folder.
- `--imp, --imports-folder-name <importsFolderName>` - Valid only if `--si` is used. Specified folder name where imports are.
- `--mde, --map-data-extension <extension>` - File extension used by various map files that were converted to text are using; Valid extensions are `.json`, `.toml`, `.yaml` and `.yml`.
- `--td, --trigger-data <triggerData>` - Specifies a path to a file that contains a `triggerdata.txt` which the map's GUI triggers use to reference how many parameters each event/condition/action/call has. Required if converting GUI triggers.
- `--tf, --triggers-filename <filename>` - Invalid if `--ct` option is specified. Used to declare the filename of triggers file which is a combination of `war3map.wtg` and `war3map.wct` files. File extension is determined by `--mde` option.
- `--ct, --compose-triggers` - Compiles triggers from folders and files instead of a single textual file back into `war3map.wtg` and `war3map.wct`.
- `--sf, --source-folder <sourceFolder>` - Valid if `--ct` option is used. Specifies the folder in which all the map's triggers and scripts are in.
- `--cse, --custom-script-extension <extension>` - Valid if `--ct` option is used. Specifies the extension which custom scripts are using, any extension works as long as the argument starts with a dot. E.g: `.j`.
- `--dis, --disabled-extension <extension>` - Valid if `--ct` option is used. Specifies the extension which disabled custom scripts are using. Appends to whatever was specified with `--cse`. E.g: `--cse .j --dis .d` results in `file.j.d`.
- `--ge, --gui-extension <extension>` - Valid if `--ct` option is used. Specifies the extension which GUI triggers and variables are using. Valid extensions are: `.json`, `.toml`, `.yaml` and `.yml`.
- `--cie, --container-info-extension <extension>` - Valid if `--ct` option is used. Specifies the extension which trigger categories' metadata is written into. Any extension works as long as it starts with a dot. The format it writes into is exclusively `.ini`.
- `--ce, --comment-extension <extension>` - Valid if `--ct` option is used. Specifies the extension which trigger comments are using. Any extension works as long as it starts with a dot. It always writes it as a simple text, not a data structure.
- `--mh, --map-header <filename>` - Valid if `--ct` option is used. Specifies the filename of the map's header script.
- `--chunk, --chunkify` - Convert split terrain files back into `war3map.w3e`, `war3map.doo`, `war3mapUnits.doo`, `war3map.w3c`, `war3map.w3r` if relevant data exists.
- `--ctf, --chunkified-terrain-folder <folderName>` - Valid only if `--chunk` option is specified. Defines what the folder inside `input` contains terrain chunks.
- `--cfe, --chunk-file-extension <extension>` - Valid only if `--chunk` option is specified. What file extension these chunk files use; Valid extensions are `.json`, `.toml`, `.yml` and `.yaml`.

- `--mosd, --merge-object-skin-data` - Merges `war3map.w3a/b/d/h/t/u/q` and `war3mapSkin.w3a/b/d/h/t/u/q` together. Can also be used to merge multiple object files of same file extension together, not necessarily skins. (Note that it's doing a stupid merge, there's no validation if object *has* the field these files specify it does)

## Target profiles
- 1.00
- 1.01
- 1.02
- 1.03
- 1.04
- 1.05
- 1.06
- 1.07
- 1.10
- 1.11
- 1.12
- 1.13
- 1.14
- 1.14b
- 1.15
- 1.16
- 1.17
- 1.18
- 1.19
- 1.20
- 1.21
- 1.22
- 1.23
- 1.24
- 1.25
- 1.26
- 1.27
- 1.28
- 1.29
- 1.30
- 1.31
- 1.32.0
- 1.32.1
- 1.32.2
- 1.32.3
- 1.32.0
- 1.32.1
- 1.32.2
- 1.32.3
- 1.32.4
- 1.32.5
- 1.32.6
- 1.32.7
- 1.32.8
- 1.32.9
- 1.32.10
- 1.32 - (same as 1.32.10)
- 1.33
- 1.34
- 1.35
- 1.36
- 2.0.0
- 2.0.1
- 2.0.2
- 2.0.3
- 2.0.4
- 2.0 - (same as 2.0.4)
- 3.0.0
- 3.0.1
- 3.0 - (same as 3.0.1)
- latest - (same as 3.0.1)

A history of each patch's editor changes to the map files' formats, and what each patch's game data (SLK) has, can be found in [docs/game-versions.md](docs/game-versions.md).
import { type DirectoryTree } from 'directory-tree'
import { LoggerFactory } from '../logging/LoggerFactory'
import path from 'path'
import { Asset, AssetType } from 'patchwork-data'

const log = LoggerFactory.createLogger('ImportComposer')

const ImportComposer = {

  composeImportRegistry: function (importsFolderTree: DirectoryTree): Asset[] {
    log.info('Composing war3map.imp file from', importsFolderTree.path, 'directory')

    const imports: Asset[] = []
    const standardImportFolder = path.join(importsFolderTree.path, 'war3mapImported')
    const fileStack: Array<DirectoryTree<Record<string, unknown>>> = [importsFolderTree]

    while (fileStack.length > 0) {
      const file = fileStack.pop()
      if (file == null) break

      if (file.type === 'directory') {
        const children = file.children

        if (children != null) {
          for (const child of children) {
            fileStack.push(child)
          }
        }
      } else {
        imports.push({
          path: path.relative(importsFolderTree.path, file.path),
          type: file.path.startsWith(standardImportFolder) ? AssetType.STANDARD : AssetType.CUSTOM
        })
      }
    }

    return imports
  },

  getImportedFilePaths: function (inputPath: string, importRegistry: Asset[]): string[] {
    log.info('Reading imported files registry')
    const importedFiles: string[] = []

    for (const entry of importRegistry) {
      importedFiles.push(path.join(inputPath, entry.path))
    }

    log.info('Found total of', importedFiles.length, 'imported files.')
    return importedFiles
  }
}

export default ImportComposer

import { FourCC, integer } from "../wc3maptranslator/CommonInterfaces"
import { Modification, ObjectData, ObjectModificationTable, ObjectType } from "../wc3maptranslator/data"

type ObjectDataMergerOutput = {
    input: string,
    expectedOutput: string,
    type: ObjectType,
    data: ObjectModificationTable
}

const objectTypeData = {} as Record<ObjectType, ObjectDataMergerOutput[]>

function mergeObjectModificationLeveledData(source: Record<integer, integer | string>, addition: Record<integer, integer | string>) {
    for (const [levelVar, value] of Object.entries(addition)) {
        source[levelVar as unknown as integer] = value
    }
}

function mergeObjectModifications(source: Modification, addition: Modification) {
    if (addition.type && addition.values) {
        if (addition.dataPointer) source.dataPointer = addition.dataPointer
        if (source.type != addition.type) {
            //todo log - overwrite all level values
            source.values = addition.values
        } else if (source.values) {
            mergeObjectModificationLeveledData(source.values, addition.values)
        } else { // types are the same - source values do not exist
            source.values = addition.values
        }
    }
}

function mergeObjectData(source: ObjectData, addition: ObjectData) {
    source.originalId = addition.originalId
    for (const [fourCC, modifications] of Object.entries(addition.modifications)) {
        if (source.modifications[fourCC]) {
            mergeObjectModifications(source.modifications[fourCC], modifications)
        } else {
            source.modifications[fourCC] = modifications
        }
    }
}

function mergeModTables(source: Record<FourCC, ObjectData>, addition: Record<FourCC, ObjectData>) {
    for (const [fourCC, objectData] of Object.entries(addition)) {
        if (source[fourCC]) {
            mergeObjectData(source[fourCC], objectData)
        } else {
            source[fourCC] = objectData
        }
    }
}

const ObjectDataMerger = {
    appendData: function (objectData: ObjectModificationTable, objectType: ObjectType, input: string, expectedOutput: string) {
        let existingData = objectTypeData[objectType]
        if (!existingData) {
            existingData = []
            objectTypeData[objectType] = existingData
        }
        existingData.push({
            input,
            type: objectType,
            data: objectData,
            expectedOutput: expectedOutput.replace('war3map.*\.w3', 'war3map.w3')
        })
    },
    exportData: function (): ObjectDataMergerOutput[] {
        return Object.values(objectTypeData).map(it => {
            return it
                .sort((a, b) => a.input.localeCompare(b.input))
                .reduce((a, b) => {
                    mergeModTables(a.data.original, b.data.original)
                    if (a.data.custom && b.data.custom) {
                        mergeModTables(a.data.custom, b.data.custom)
                    } else if (b.data.custom) {
                        a.data.custom = b.data.custom
                    }
                    return a
                })
        })
    }
}

export { ObjectDataMerger }
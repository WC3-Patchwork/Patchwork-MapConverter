import { ObjectModificationTable, ObjectType } from "@/wc3maptranslator/data"

type ObjectDataMergerOutput = {
    expectedOutput: string,
    type: ObjectType,
    data: ObjectModificationTable
}

const objectTypeData = {} as Record<ObjectType, ObjectDataMergerOutput>

const ObjectDataMerger = {
    appendData: function(objectData: ObjectModificationTable, objectType: ObjectType, expectedOutput: string) {

    },
    exportData: function(): ObjectDataMergerOutput[] {
        
    }
}

export { ObjectDataMerger }
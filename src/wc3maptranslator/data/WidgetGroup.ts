import { integer } from "../CommonInterfaces";

interface WidgetGroup {
    groupId: integer
    groupName: string
}

interface WidgetGroups {
    chunk1: WidgetGroup[]
    chunk2: WidgetGroup[]
}

export type { WidgetGroup, WidgetGroups }
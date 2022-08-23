import { v4 } from 'uuid'
import { ObjectId } from 'mongodb'

export const UUID = {
    generate: (): string => v4(),
    toObjectID: (id: string): ObjectId => new ObjectId(id),
    toUUID: (objectId: ObjectId): string => objectId.toString(),
}

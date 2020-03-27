import { ObjectId } from "mongodb";
export interface InsertResult {
    ok: boolean;
    insertedCount: number;
    insertedIds: {
        [key: number]: ObjectId;
    };
}

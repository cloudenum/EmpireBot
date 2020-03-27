import { DbClient, DBError } from "../";
import { MongoError, Collection, FilterQuery, FindOneOptions, Cursor, Db } from "mongodb";
import { Logger } from "../../helpers";
import { InsertResult } from "./InsertResult";
import { UpdateResult } from "./UpdateResult";
import { DeleteResult } from "./DeleteResult";

export class BaseModel {
    protected collectionName: string
    protected collection: Collection

    constructor(collectionName: string) {
        this.collectionName = collectionName
        this.collection = DbClient.db().collection(this.collectionName)
    }

    public async insert(data: any): Promise<InsertResult> {
        return new Promise<InsertResult>((resolve, reject) => {
            let docs: any[] = []
            if (!Array.isArray(data)) {
                docs[0] = data
            }

            this.collection.insertMany(docs)
                .then(OpResult => {
                    resolve({
                        ok: OpResult.result.ok === 1 ? true : false,
                        insertedCount: OpResult.insertedCount,
                        insertedIds: OpResult.insertedIds
                    })
                })
                .catch(err => {
                    if (err instanceof MongoError) {
                        Logger.error(`Insert Error > ${err.errmsg}`)
                        throw new DBError(err.errmsg)
                    } else {
                        Logger.error(err.stack)
                        throw err
                    }
                })
        })
    }

    public find(query: FilterQuery<any> = {}, options?: FindOneOptions): Cursor {
        try {
            return this.collection.find(query, options)
        } catch (err) {
            if (err instanceof MongoError) {
                Logger.error(`Read Error > ${err.errmsg}`)
                throw new DBError(err.errmsg)
            } else {
                Logger.error(err.stack)
                throw err
            }
        }

    }

    public async update(filter: FilterQuery<any>, data: {}): Promise<UpdateResult> {
        return await this.collection.updateMany(filter, data)
            .then(OpResult => {
                return {
                    ok: OpResult.result.ok === 1 ? true : false,
                    updatedCount: OpResult.modifiedCount
                }
            })
            .catch(err => {
                if (err instanceof MongoError) {
                    Logger.error(`Update Error > ${err.errmsg}`)
                    throw new DBError(err.errmsg)
                } else {
                    Logger.error(err.stack)
                    throw err
                }
            })
    }

    public async delete(filter: FilterQuery<any>): Promise<DeleteResult> {
        return await this.collection.deleteMany(filter)
            .then(OpResult => {
                return {
                    ok: OpResult.result.ok === 1 ? true : false,
                    deletedCount: OpResult.deletedCount ? OpResult.deletedCount : 0
                }
            })
            .catch(err => {
                if (err instanceof MongoError) {
                    Logger.error(`Update Error > ${err.errmsg}`)
                    throw new DBError(err.errmsg)
                } else {
                    Logger.error(err.stack)
                    throw err
                }
            })
    }
}


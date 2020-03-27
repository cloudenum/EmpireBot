import { env } from '../../helpers'
import { MongoClient, Db } from 'mongodb'
import { Logger as logger } from '../../helpers'
import { DBError } from '../errors'
// import { DBError } from "./../../errors"
const conString = `mongodb://${env.MONGODB_USER}:${encodeURIComponent(env.MONGODB_PASS)}@${env.MONGODB_HOST}/${env.MONGODB_DATABASE}?${env.MONGODB_OPTIONS}`
const DbClient = new MongoClient(conString, { useUnifiedTopology: true })
const DbPromise = DbClient.connect().then((cl) => {
    logger.info(`MongoDB connected to ${cl.db().databaseName}`)
    return cl
}).catch(err => {
    logger.error(`DB Error > ${err.message}`)
})

export { DbPromise, DbClient }

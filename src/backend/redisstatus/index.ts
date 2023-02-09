import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { RedisSimilarity } from "../services/redis"
const _ = require('lodash')

const redisStatusTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const redis = new RedisSimilarity(process.env.REDIS_URL ? process.env.REDIS_URL : "", process.env.REDIS_PW ? process.env.REDIS_PW : "")
    try {
        await redis.connect()
        const results = await redis.getKeys()
        
        context.res = {
            status: 200,
            body: {
                redisStatus: results
            }
        }
    } catch (err) {
        context.log(err)
        context.res = {
            status: 500,
            body: err.message
        }
    } finally {
        await redis.disconnect()
    }
};

export default redisStatusTrigger;
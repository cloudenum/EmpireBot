import { BaseModel } from "../system";
import { Logger } from "../helpers";

class GuildsModel extends BaseModel {
    constructor() {
        super('guilds')
    }

    public async checkIDExist(id: string): Promise<boolean> {
        return await this.find({ guild_id: id }, { projection: { 'guild_id': 1 } })
            .limit(1).count() > 0 ? true : false
        // .toArray()
        // .then(res => {
        //     console.log(res)
        //     if (res.length > 0)
        //         return true
        //     else
        //         return false
        // })
        // .catch(err => {
        //     Logger.error(err.stack)
        //     throw err
        // })
    }
}

export const Guilds = new GuildsModel() 
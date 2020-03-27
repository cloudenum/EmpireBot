import { BaseModel } from "../system";

class GuildsModel extends BaseModel {
    constructor() {
        super('guilds')
    }

    public checkIDExist(id: string): boolean {
        console.log(Guilds.find({ guild_id: id }, { projection: { 'guild_id': 1, 'name': 0, 'ownerID': 0 } }))
        return true
    }
}

export const Guilds = new GuildsModel() 
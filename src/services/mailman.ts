import { TextChannel } from 'discord.js'
import logger from '../helpers/LoggerHelper'

export class SendOpt {
    public quote = false
}

class Mailman {
    public sendToTextChannel(channel: TextChannel, message: string): boolean {
        let status = false
        channel.send(message)
            .then(msg => status = true)
            .catch(r => logger.error(r))

        return status
    }

    public createQuote(message: string): string {
        return `> ${message}`
    }

}

export default new Mailman()

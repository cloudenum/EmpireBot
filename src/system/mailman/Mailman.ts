import { TextChannel } from 'discord.js'
import { Logger as logger } from '../../helpers'

export class Mailman {
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

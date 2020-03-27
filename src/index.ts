import { env } from "./helpers"
import { Client, TextChannel } from 'discord.js'
import { Logger as logger } from "./helpers"
import {
    Bot,
    BotProduct,
    Mailman,
    DbPromise,
    BotError,
    DBError
} from './system'
import { Guilds } from './models'

(async () => {
    logger.info('Bot is initializing...')

    const mailman = new Mailman()
    const client = new Client()
    const bot = new Bot()
    const DbClient = await DbPromise.then(cl => cl)

    if (!DbClient || !DbClient.isConnected()) {
        logger.error(`Can't connect to Database`)
        logger.info(`Bot is shutting down...`)
        process.exit(1)
    }

    client.on('ready', () => {
        logger.info('Bot is ready!')
    })

    client.on('guildCreate', async guild => {
        try {
            logger.info(`Bot joined to ${guild.name} - (${guild.id})`)
            if (!(await Guilds.checkIDExist(guild.id))) {
                Guilds.insert({
                    guild_id: guild.id,
                    name: guild.name,
                    ownerID: guild.ownerID,
                })
            }
            const channel = guild.channels.cache.find(ch => ch.type === "text")

            if (channel) {
                logger.info(`${guild.name} greeted!`)
                mailman.sendToTextChannel(<TextChannel>channel, bot.greetNewGuild())
            }
        } catch (err) {
            logger.error(err.stack)
            logger.info(`Guild ${guild.name} - (${guild.id}) doesn't have a text channel?`)
        }
    })

    client.on('message', message => {
        if (message.content && message.author && message.channel) {
            if (message.content.substring(0, 2) === 'e!') {
                let cmd = message.content.substring(2)
                logger.info(`Receiving command from ${message.author.username} - (${message.author.id})`)
                logger.info(`The command is ${cmd}`)

                try {
                    let product: BotProduct = bot.execute(cmd, message)

                    if (product.sendOpt.quote) {
                        let quote = mailman.createQuote(message.content)
                        mailman.sendToTextChannel(<TextChannel>message.channel, `${quote}\n${product.data}`)
                    } else {
                        mailman.sendToTextChannel(<TextChannel>message.channel, `${product.data}`)
                    }
                } catch (err) {
                    if (err instanceof BotError) {
                        mailman.sendToTextChannel(<TextChannel>message.channel, err.message)
                    } else {
                        logger.error(err.stack)
                        throw err; //unknown error
                    }

                    logger.error(err.message)
                }

                logger.info('Command execution finished.')
            }
        }
    })

    logger.info('Init finished.')
    logger.info('Logging in to Discord...')

    client.login(env.DISCORD_TOKEN)
        .then(() => {
            logger.info('Login success!')
        })
        .catch(err => {
            logger.error("Login failed!")
            logger.error(err)
            logger.error(err.stack)
            logger.info('See logs/errors.log for more details')
            logger.info(`Bot is shutting down...`)
            process.exit(1)
        })
})()
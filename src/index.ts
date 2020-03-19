import dotenv from 'dotenv'
import { Client, TextChannel } from 'discord.js'
import { Logger as logger } from "./helpers"
import { Bot, BotProduct, Mailman } from './services'
import { BotError } from './error'

logger.info('Bot initializing ..')

dotenv.config()

const mailman = new Mailman()
const client = new Client()
const bot = new Bot()

client.on('ready', () => {
    logger.info('Bot is ready!')
})

client.on('guildCreate', guild => {
    const channel = <TextChannel>guild.channels.cache.find(
        ch => ch.name === 'general'
    )

    mailman.sendToTextChannel(channel, bot.greetNewGuild())
})

client.on('message', message => {
    if (message.content.substring(0, 2) === 'e!') {
        let cmd = message.content.substring(2)
        logger.info(`Receiving command from ${message.author.username} - (${message.author.id})`)
        logger.info(`The command is ${cmd}`)
        try {
            let product: BotProduct = bot.execute(cmd, message)
            if (product.sendOpt) {
                if (product.sendOpt.quote) {
                    let quote = mailman.createQuote(message.content)
                    mailman.sendToTextChannel(<TextChannel>message.channel, `${quote}\n${product.data}`)
                } else {
                    mailman.sendToTextChannel(<TextChannel>message.channel, `${product.data}`)
                }
            } else {
                mailman.sendToTextChannel(<TextChannel>message.channel, `${product.data}`)
            }
        } catch (err) {
            if (err instanceof BotError) {
                mailman.sendToTextChannel(<TextChannel>message.channel, err.message)
            } else {
                logger.error(err)
                throw err; //unknown error
            }

            logger.error(err)
        }

        logger.info('Command execution finished.')
    }
})

logger.info('Logging in to Discord...')

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        logger.info('Login success!')
    })
    .catch(err => {
        logger.error("Login failed!")
        logger.error(err)
        logger.info('Bot stopped.')
    })

logger.info('Init finished.')

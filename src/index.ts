import dotenv from 'dotenv'
import { Client, TextChannel } from 'discord.js'
import logger from "./helpers/LoggerHelper"
import i18nLoader from './i18n/i18n'
import Bot, { IProduct } from './services/bot/bot'
import mailman from './services/mailman'

dotenv.config()

i18nLoader.setLocale('en')
const i18n = i18nLoader.getPolyglot()

const client = new Client()
const bot = new Bot()

client.on('ready', () => {
    logger.info(i18n.t('bot_connected'))
    logger.info(`Logged in as ${client.user.username} - (${client.user.id})`)
})

client.on('guildCreate', guild => {
    const channel = <TextChannel>guild.channels.cache.find(
        ch => ch.name === 'general'
    )

    channel.send('Hey aku disini gayn hehe \nAku dibikin sama <@>')
})

client.on('message', message => {
    if (message.content.substring(0, 2) === 'e!') {
        let cmd = message.content.substring(2)
        logger.info(`Receiving command from ${message.author.username} - (${message.author.id})`)
        logger.info(`The command is ${cmd}`)

        let product: IProduct = bot.execute(cmd)
        if (product.sendOpt.quote) {
            let quote = mailman.createQuote(message.content)
            mailman.sendToTextChannel(<TextChannel>message.channel, `${quote}\n${product.data}`)
        }

        logger.info('Command execution finished.')
    }
})

client.login(process.env.DISCORD_TOKEN)

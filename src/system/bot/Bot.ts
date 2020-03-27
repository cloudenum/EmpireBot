import { Message, PartialMessage } from 'discord.js'
import { I18nLoader } from '../i18n'
import { BotError } from "../errors";
import { BotProduct } from './BotProduct'
import { Guilds } from '../../models';

I18nLoader.loadResources()
I18nLoader.setLocale('en')

export class Bot {
    private working = false
    private i18n = I18nLoader.getPolyglot()
    private command: string = ''

    public greetNewGuild(): string {
        return this.i18n.t('greet_new_guild')
    }

    public execute(command: string, messageObj?: Message | PartialMessage): BotProduct {
        this.working = true
        this.command = command
        let args = command.split(' ')
        command = args.splice(0, 1)[0]

        switch (command) {
            case 'ping':
                return this.ping()
            case 'whoami':
                if (messageObj && messageObj.author) return this.whoami(messageObj.author.id)
            case 'add':
                return this.add(parseInt(args[0]), parseInt(args[1]))
            case 'change-locale':
                return this.changeLocale(args[0])
            default:
                break
        }

        this.working = false

        // return { data: null, sendOpt: { quote: false } }
        throw new BotError(this.i18n.t('unknown_command'))
    }

    public changeLocale(localeID: string): BotProduct {
        if (typeof localeID === 'undefined' || localeID === '') {
            throw new BotError(this.i18n.t('no_argument', { arguments: "<localeID>" }), this.command)
        }

        if (!I18nLoader.setLocale(localeID)) {
            throw new BotError(this.i18n.t('locale_change_not_found', { newLocale: `<${localeID}>` }))
        }

        this.i18n = I18nLoader.getPolyglot()
        return { data: this.i18n.t('locale_change_success'), sendOpt: { quote: false } }
    }

    public isWorking(): boolean {
        return this.working
    }

    public ping(): BotProduct {
        return { data: this.i18n.t('pong'), sendOpt: { quote: false } }
    }

    public whoami(userID: string): BotProduct {
        return {
            data: this.i18n.t('whoami', { userID: userID }),
            sendOpt: { quote: true }
        }
    }

    public add(a: number, b: number): BotProduct {
        return {
            data: a + b,
            sendOpt: { quote: true }
        }
    }
}

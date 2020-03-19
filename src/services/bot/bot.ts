import { Message, PartialMessage } from 'discord.js'
import { I18nLoader } from '../../i18n'
import { BotError } from "../../error";
import { BotProduct } from './BotProduct'

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
        args = args.splice(0, 1)

        switch (command) {
            case 'ping':
                return this.ping()
            case 'whoami':
                return this.whoami(messageObj.author.id)
            case 'add':
                return this.add(parseInt(args[0]), parseInt(args[1]))
            case 'change-locale':
                return this.changeLocale(args[0])
            default:
                break;
        }

        this.working = false
    }

    public changeLocale(localeID: string): BotProduct {
        if (!localeID) {
            throw new BotError(this.i18n.t('no_argument', { arguments: "<localeID>" }), this.command)
        }

        I18nLoader.setLocale(localeID)
        this.i18n = I18nLoader.getPolyglot()

        return { data: this.i18n.t('locale_change_success') }
    }

    public isWorking(): boolean {
        return this.working
    }

    public ping(): BotProduct {
        return { data: this.i18n.t('pong') }
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

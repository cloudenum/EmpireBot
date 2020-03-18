import i18nLoader from '../../i18n/i18n'
import { SendOpt } from '../mailman'

i18nLoader.setLocale('en')

export interface IProduct {
    data: any,
    sendOpt?: SendOpt
}

export default class Bot {
    private working = false
    private i18n = i18nLoader.getPolyglot()

    public execute(command: string): IProduct {
        this.working = true
        let args = command.split(' ')
        args = args.splice(0, 1)

        switch (command) {
            case 'ping':
                return this.ping()
            case 'whoami':
                return this.whoami(args[0])
            case 'add':
                return this.add(parseInt(args[0]), parseInt(args[1]))
            case 'change-locale':
                return this.changeLocale(args[0])
            default:
                break;
        }

        this.working = false
    }

    public changeLocale(localeID: string): IProduct {
        i18nLoader.setLocale(localeID)
        this.i18n = i18nLoader.getPolyglot()

        return { data: `Locale has been set to ${localeID}` }
    }

    public isWorking(): boolean {
        return this.working
    }

    public ping(): IProduct {
        return { data: this.i18n.t('pong') }
    }

    public whoami(userID: string): IProduct {
        return {
            data: this.i18n.t('whoami', { userID: userID }),
            sendOpt: { quote: true }
        }
    }

    public add(a: number, b: number): IProduct {
        return {
            data: a + b,
            sendOpt: { quote: true }
        }
    }
}

import fs from 'fs'
import path from 'path'
// import logger from '../helpers/LoggerHelper'
import Polyglot from 'node-polyglot'
import { Locale } from './Locale'

export class I18nLoader {
    private static locales: Locale[] = []
    private static localeID: string = 'en'

    public static load() {
        fs.readdirSync('/Makaryo/EmpireBot/locale').forEach(file => {
            let localeID = file.split('.json', 1)[0]
            let filepath = path.join(__dirname, `../../locale/${localeID}.json`)
            let rawJSON = fs.readFileSync(filepath)

            this.locales.push({
                identifier: localeID,
                polyglot: new Polyglot({ phrases: JSON.parse(rawJSON.toString()) })
            })
        })
    }

    public static getPolyglot(): Polyglot {
        return this.locales.find(locale => locale.identifier === this.localeID).polyglot
    }

    public static setLocale(id: string): void {
        this.localeID = id
    }
}

import fs from 'fs'
import path from 'path'
// import logger from '../helpers/LoggerHelper'
import Polyglot from 'node-polyglot'
import { Locale } from './Locale'

export class I18nLoader {
    private static locales: Locale[] = []
    private static localeID: string = 'en'

    public static loadResources() {
        fs.readdirSync(path.join(__dirname, `./../../../locales`)).forEach(file => {
            let localeID = file.split('.json', 1)[0]
            let filepath = path.join(__dirname, `./../../../locales/${file}`)
            let rawJSON = fs.readFileSync(filepath)

            this.locales.push({
                identifier: localeID,
                polyglot: new Polyglot({ phrases: JSON.parse(rawJSON.toString()) })
            })
        })
    }

    public static getPolyglot(): Polyglot {
        let item = this.locales.find(locale => locale.identifier === this.localeID)

        if (item) {
            return item.polyglot
        }

        throw new Error(`Can't find the specified locale ${this.localeID}`)
    }

    public static setLocale(id: string): boolean {
        let found = this.locales.find(locale => locale.identifier === id)
        if (!found) {
            return false
        }

        this.localeID = id
        return true
    }
}

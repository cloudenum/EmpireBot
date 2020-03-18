import fs from 'fs'
import path from 'path'
import logger from '../helpers/LoggerHelper'
import Polyglot from 'node-polyglot'

class I18n {
    private locales: Locale[] = []
    private localeID: string = 'en'

    public constructor() {
        fs.readdirSync('/Makaryo/EmpireBot/locale').forEach(file => {
            let localeID = file.split('.json', 1)[0]
            let filepath = path.join(__dirname, `../../locale/${localeID}.json`)
            logger.info(filepath)
            let rawJSON = fs.readFileSync(filepath)

            this.locales.push({
                identifier: localeID,
                polyglot: new Polyglot({ phrases: JSON.parse(rawJSON.toString()) })
            })
        })
    }

    public getPolyglot(): Polyglot {
        return this.locales.find(locale => locale.identifier === this.localeID).polyglot
    }

    public setLocale(id: string): void {
        this.localeID = id
    }
}

interface Locale {
    identifier: string
    polyglot: Polyglot
}

export default new I18n()
import winston from "winston"

export const Logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} ${level}: ${message}`
                })
            )
        }),
        new winston.transports.File({
            filename: './logs/bot.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: './logs/errors.log',
            level: 'error'
        })
    ]
})

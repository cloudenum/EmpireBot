export class BotError extends Error {
    public command?: string
    public args?: string[]

    constructor(message?: string, command?: string, args?: string[]) {
        super(message)
        this.name = "BotError"
        this.command = command
        this.args = args
    }
}
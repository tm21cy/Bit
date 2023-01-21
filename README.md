
![Logo](https://media.discordapp.net/attachments/924775610067325039/1066340438308552814/Bit_Discord_Bot_Banner_High_Res..png)


# Bit Discord Bot
Bit is a [Discord](https://discord.com) bot developed to aid in the utility functions of the [*Hello World!* Discord server](https://discord.com/invite/bACX3A6vkd).

[*Hello World!*](https://discord.com/invite/bACX3A6vkd) is a programming help server on [Discord](https://discord.com), dedicated to providing an easygoing developer experience while also allowing developers, new and old, to seek help from community members.


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Tech Stack

- TypeScript - used in conjunction with Node.js and the [Discord.js](https://discord.js.org/#/) package, TypeScript provides the driver code for the bulk of Bit's functionality. As is standard, we compile to JavaScript at execution.
- MySQL - Utilizing the [Sequelize](https://sequelize.org) package, [Vitess](https://vitess.io), a MySQL-compatible database, is used to store pertinent user data. In the future, it may also be used for storing command execution stats, error traces, and other useful debugging data.
    - In production and our own development, we use [PlanetScale](https://planetscale.com) for hosting the database.

## Deployment

Bit uses TypeScript and Vitess, a MySQL-compatible Database. You will need to configure both these tools on your own system, but we can provide you with some helpful building blocks.

**Vitess** - Our usage of Sequelize relies on two variables, `DATABASE_URL_PROD` and `DATABASE_URL_DEV`. Use the former for storage of production build data, and the latter for development build data, or homologate the two to your heart's content. Please store these variables in your `.env` file. For all of our Database needs, we utilize [PlanetScale](https://planetscale.com).

**ENV Example** - You can find a example env [here](https://github.com/tm21cy/Bit/blob/main/.env.example).

**Scripts**
* `pnpm build`, which compiles Typescript and outputs it in the `dist` directory (created upon running the command).
* `start`, which compiles Typescript and runs the bot in production mode using [PM2]().
* `start:dev`, which compiles Typescript and runs the bot in development mode using Node.js.

We also provide a command template, located in `src/commands/template.dev`.

## Contributors and maintainers

- Maintainers
    - Tyler McDonald (Blizzy#8953), Co-Developer, Refactor & Beta Coordinator
    - net-tech-#7475, Co-Developer, Production Coordinator
- Contributors
    - Codeize (Codeize#8881)


## License

Bit is an open-source tool; however, please note that the core of its functionality is designed for use within the [*Hello World!*](https://discord.com/invite/bACX3A6vkd) Discord server. You are, nonetheless, free to derive functionality for your own personal or commercial use. If you so choose, we would appreciate a credit for our many man-hours spent developing Bit, but you are not obligated to do so.

If there are any questions regarding this provision, please don't hesitate to contact Blizzy#8953 on Discord, or email him at tm21cy@outlook.com.

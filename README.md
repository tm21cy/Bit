# Bit - Your Hello World! Companion
Bit is a bot developed by Blizzy#8953 and net-tech-#7475 to aid in the utility functions of the *Hello World!* Discord server. 

*Hello World!* is a programming help server on Discord, dedicated to providing an easygoing developer experience while also allowing developers, new and old, to seek help from community members.

Bit utilizes the following languages:
* TypeScript - used in conjunction with Node.js and the Discord.js package, TypeScript provides the driver code for the bulk of Bit's functionality. As is standard, we compile to JavaScript at execution.
* MySQL - Utilizing the Sequelize package, MySQL is used to store pertinent user data. In the future, it may also be used for storing command execution stats, error traces, and other useful debugging data.

## License
Bit is an open-source tool; however, please note that the core of its functionality is designed for use within the *Hello World!* Discord server. You are, nonetheless, free to derive functionality for your own personal or commercial use. If you so choose, we would appreciate a credit for our many man-hours spent developing Bit, but you are not obligated to do so.

If there are any questions regarding this provision, please don't hesitate to contact Blizzy#8953 on Discord, or email him at tm21cy@outlook.com.

## Deploying Bit
As previously stated, Bit uses TypeScript and MySQL. You will need to configure both these tools on your own system, but we can provide you with some helpful building blocks.


**TypeScript** - We have included our `tsconfig.json` file for your use. This file is fairly standard, however please ensure you accurately account for a `dist` output directory.

**MySQL** - Our usage of Sequelize relies on two variables, `DATABASE_URL_PROD` and `DATABASE_URL_DEV`. Use the former for storage of production build data, and the latter for development build data, or homologate the two to your heart's content. Please store these variables in your `.env` file. For all of our MySQL needs, we utilize PlanetScale.

**Discord.js** - Please provide 4 variables, namely `DISCORD_TOKEN`, `CLIENT_ID`, `DEV_ID_1`, and optionally, `DEV_ID_2`, in your `.env` file. The two former are used for deployment of the bot, and the two latter are used for verifying your identity as a developer on the project for debugging functionality.

**Misc** - Please also provide a `NODE_ENV` variable, either "development" or "production", which will specify the state the bot is deployed in and, consequentially, the database utilized.

**`package.json`** - This file specifies some helpful scripts:
* `pnpm build`, which builds and executes the project.
* `pnpm fullbuild`, which builds files, deploys new commands, and executes the project.
* `dev`, which simply executes the existing `dist/index.js` file.
* `cmd-deploy`, which simply deploys all slash commands globally using `dist/deploy-commands.js`.

We also provide a command template for your perusal, located in `src/commands/template.dev`.

## Developer Credits
Tyler McDonald (Blizzy#8953), Co-Developer, Refactor & Beta Coordinator

net-tech-#7475, Co-Developer, Production Coordinator


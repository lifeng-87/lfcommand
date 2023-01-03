# LFcord
A handler who can handle discord.js's command and event

## Install
```
npm install lfcord
yarn add lfcord
```
## Mode
You can choose mode when command register
```javascript
'dev'  // regist all command in guild
'prod' // regist command in application if guildCommand is true it will regist the command in guild
'debug'// same as dev mode
```

## Example
```javascript
const { LFcord } = require('lfcord');
const { Client,	GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const lfcord = new LFcord(client);

lfcord.addEvent({
	name: 'ready',
	execute: () => {
		console.log(`Logged in as ${client.user?.tag}!`);
	},
});

lfcord.addCommand({
  data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	guildCommand: true,
	execute: async ({ interaction, client }) => {
		interaction.reply('Pong!');
	},
});

lfcord.registCommands(
	YOUR_TOKEN,
	YOUR_GUILD_ID,
	YOUR_CLIENT_ID,
	THE_REGIST_MODE
);
```
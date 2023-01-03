require('dotenv').config();

const {
	Client,
	EmbedBuilder,
	GatewayIntentBits,
	SlashCommandBuilder,
} = require('discord.js');
const { LFcord } = require('lfcord');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

const lfcord = new LFcord(client);

lfcord.addCommand({
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('回復機器人延遲'),
	guildCommand: true,
	execute: async ({ interaction, client }) => {
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Blurple')
					.setDescription(`**Ping:** ${client.ws.ping}(ms)`),
			],
		});
	},
});

lfcord.addEvent({
	name: 'ready',
	execute: () => {
		console.log(`hehe`);
	},
});

lfcord.registCommands(
	process.env.TOKEN,
	process.env.GUILD_ID,
	process.env.CLIENT_ID,
	'dev'
);

client.login(process.env.TOKEN);

require('dotenv').config();

const { Client, EmbedBuilder, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const { LFCommand, Mode }  = require("../dist");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

const lfCommand = new LFCommand(client);

lfCommand.addCommand({
    data:new SlashCommandBuilder()
    .setName('ping')
    .setDescription('回復機器人延遲'),
    guildCommand:true,
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

lfCommand.registerCommands(process.env.TOKEN, process.env.GUILD_ID, process.env.CLIENT_ID, Mode.dev);

client.login(process.env.TOKEN);
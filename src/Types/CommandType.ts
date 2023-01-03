import {
	ChatInputCommandInteraction,
	CommandInteractionOptionResolver,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { Client } from 'discord.js';

export interface CommandType {
	data:
		| Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'>
		| SlashCommandSubcommandsOnlyBuilder;
	cooldown?: number;
	guildCommand?: boolean;
	nsfw?: boolean;
	execute: (options: RunOptions) => Promise<any>;
}

interface RunOptions {
	client: Client;
	interaction: ChatInputCommandInteraction;
	args: CommandInteractionOptionResolver;
}

import {
	CacheType,
	Client,
	Collection,
	CommandInteractionOptionResolver,
	Interaction,
	TextChannel,
	Routes,
	REST,
} from 'discord.js';
import EventEmitter from 'events';
import { Mode } from '..';
import { CommandType } from '../Types/CommandType';
import { EventsType } from '../Types/EventsType';

export class LFcord extends EventEmitter {
	private commands: Collection<string, CommandType> = new Collection();
	private cooldowns: Collection<string, any> = new Collection();
	private client: Client;

	constructor(cilent: Client) {
		super();

		this.client = cilent;
		this.handleCommand();
	}

	private handleCommand() {
		const listener = async (interaction: Interaction<CacheType>) => {
			if (interaction.isChatInputCommand()) {
				const command = this.commands.get(interaction.commandName);
				if (!command) return this.commands.delete(interaction.commandName);

				if (command.nsfw && !(<TextChannel>interaction.channel)?.nsfw) {
					return this.emit('isNotNSFWChannel', interaction.channel);
				}

				if (!this.cooldowns.has(command.data.name)) {
					this.cooldowns.set(command.data.name, new Collection());
				}

				const now = Date.now();
				const timestamps = this.cooldowns.get(command.data.name);
				const cooldownAmount = command.cooldown || 500;

				if (timestamps.has(interaction.user.id)) {
					const exiprationTime =
						timestamps.get(interaction.user.id) + cooldownAmount;

					if (now <= exiprationTime) {
						const timeLeft = exiprationTime - now;
						return this.emit('isCooldown', timeLeft);
					}
				}

				timestamps.set(interaction.user.id, now);
				setTimeout(
					() => timestamps.delete(interaction.user.id),
					cooldownAmount
				);

				try {
					command.execute({
						args: interaction.options as CommandInteractionOptionResolver,
						client: this.client,
						interaction: interaction,
					});
				} catch (err) {
					console.log(err);
					return this.emit('error', err);
				}
			}
		};

		this.client.on('interactionCreate', async (interaction) => {
			listener(interaction);
		});
	}

	public async registerCommands(
		token: string,
		guildId: string,
		clientId: string,
		mode: string = Mode.dev
	) {
		const rest = new REST({ version: '10' }).setToken(token);
		try {
			if (mode === 'prod') {
				const guildCommands = this.commands.filter((cmd) => cmd.guildCommand);
				const globalCommands = this.commands.filter((cmd) => !cmd.guildCommand);

				// ====global command==== //
				const globalCommandData = globalCommands.map((command) => command.data);

				this.emit('onApplicationCmdReload', globalCommandData.length);

				const globalData: any = await rest.put(
					Routes.applicationCommands(clientId),
					{ body: globalCommandData }
				);

				this.emit('onApplicationCmdReloaded', globalCommandData.length);

				// ====guild command==== //
				const guildCommandData = guildCommands.map((command) => command.data);

				this.emit('onGuildCmdReload', globalCommandData.length);

				const guildData: any = await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: guildCommandData }
				);

				this.emit('onGuildCmdReloaded', globalCommandData.length);
			} else {
				this.emit(
					'onGuildCmdReload',
					this.commands.map((command) => command.data).length
				);

				const guildData: any = await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: this.commands.map((command) => command.data) }
				);

				this.emit('onGuildCmdReloaded', guildData.length);
			}
		} catch (error) {
			console.error(error);
		}
	}

	public addCommand(command: CommandType) {
		this.commands.set(command.data.name, command);
	}

	public on<K extends keyof EventsType>(
		eventName: K,
		listener: (...args: EventsType[K]) => void
	): this {
		return this;
	}
}

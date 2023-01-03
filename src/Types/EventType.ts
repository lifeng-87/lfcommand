import { ClientEvents } from 'discord.js';

export interface EventType<Key extends keyof ClientEvents> {
	name: Key;
	execute: (...args: ClientEvents[Key]) => Promise<any>;
}

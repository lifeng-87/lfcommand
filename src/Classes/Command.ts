import { CommandType } from '../Types';

export class Command implements CommandType {
	constructor(public data, public execute) {}
}

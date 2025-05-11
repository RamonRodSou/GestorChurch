import { IUser } from '@domain/interface/IUser';
import { EMPTY } from '@domain/utils/string-utils';
import { v4 as uuidv4 } from 'uuid';

export abstract class User implements IUser {
	constructor(
		public readonly id: string = uuidv4(),
		public name: string = EMPTY,
		public phone: string = EMPTY,
		protected password: string = EMPTY,
		public createdAt: string = new Date().toISOString()
	) { }

	abstract getPasswordHash(): Promise<string>;
}
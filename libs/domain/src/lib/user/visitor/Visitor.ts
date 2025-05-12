import { EMPTY } from '@domain/utils/string-utils';
import { v4 as uuidv4 } from 'uuid';

export class Visitor {
	constructor(
		public readonly id: string = uuidv4(),
		public name: string = EMPTY,
        public phone: string = EMPTY,
        public visitHistory: string[] = [],
		public createdAt: string = new Date().toISOString()
	) {	}

	static fromJson(json: any): Visitor {
        return new Visitor(
            json.id,
            json.name,
            json.phone, 
            json.visitHistory || [],
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            visitHistory: this.visitHistory,
            createdAt: this.createdAt,
        };
    }
}
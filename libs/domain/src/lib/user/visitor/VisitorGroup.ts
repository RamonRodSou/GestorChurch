import { EMPTY } from '@domain/utils/string-utils';
import { v4 as uuidv4 } from 'uuid';

export class VisitorGroup {
	constructor(
		public readonly id: string = uuidv4(),
		public name: string = EMPTY,
        public phone: string = EMPTY,
        public groupId: string | null = null,
        public isActive: boolean = true,
		public createdAt: string = new Date().toISOString()
	) {	}

	static fromJson(json: any): VisitorGroup {
        return new VisitorGroup(
            json.id,
            json.name,
            json.phone, 
            json.groupId,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            groupId: this.groupId,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}
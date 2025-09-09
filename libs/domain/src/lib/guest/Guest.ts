import { EMPTY } from '@domain/utils';
import { v4 as uuidv4 } from 'uuid';

export class Guest {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public phone: string = EMPTY,
        public birthdate: Date | null = null,
        public lotId: string = EMPTY,
        public ticketNumber: number = 0,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): Guest {
        return new Guest(
            json.id,
            json.name,
            json.phone,
            new Date(json.birthdate),
            json.lotId,
            json.ticketNumber,
            json.isActive,
            json.createdAt,
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            birthdate: this.birthdate ? this.birthdate.toISOString() : null,
            lot: this.lotId,
            ticketNumber: this.ticketNumber,
            isActive: this.isActive,
            createdAt: this.createdAt
        };
    }
} 
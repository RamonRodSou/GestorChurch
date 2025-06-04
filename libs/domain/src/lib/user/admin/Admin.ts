import { EMPTY } from "@domain/utils/string-utils";
import { v4 as uuidv4 } from 'uuid';

export class Admin {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public phone: string = EMPTY,
        public email: string = EMPTY,
        public password: string = EMPTY,
    ) { }

    static fromJson(json: any): Admin {
        return new Admin(
            json.id,
            json.name,
            json.phone,
            json.email,
            json.password,
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            email: this.email,
            password: this.password,
        };
    }
}

export class AdminSummary {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public email: string = EMPTY,
        public password: string = EMPTY,
        public permission?: number | null
    ) { }

    static fromJson(json: any): AdminSummary {
        return new AdminSummary(
            json.id,
            json.name,
            json.email,
            json.password,
            json.permission ?? null
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
            permission: this.permission ?? null
        };
    }
}
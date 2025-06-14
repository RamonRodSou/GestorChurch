import { PermissionLevel } from "@domain/enums";
import { EMPTY } from "@domain/utils/string-utils";
import bcrypt from "bcryptjs";
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
        public permission: PermissionLevel = PermissionLevel.VOLUNTARIO,
        public isActive: boolean = true,
        public password: string = EMPTY
    ) { }

    static fromJson(json: any): AdminSummary {
        return new AdminSummary(
            json.id,
            json.name,
            json.email,
            json.permission,
            json.isActive,
            json.password ?? EMPTY
        );
    }

    async toJSON(): Promise<object> {
        return {
            id: this.id,
            email: this.email,
            password: await this.getPasswordHash(),
            isActive: this.isActive,
            permission: this.permission
        };
    }

    async getPasswordHash(): Promise<string> {
        return bcrypt.hash(this.password, 10);
    }
}
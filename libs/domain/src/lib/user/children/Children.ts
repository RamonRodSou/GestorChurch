import { v4 as uuidv4 } from 'uuid';
import { User } from '../User';
import { EMPTY } from '@domain/utils/string-utils';
import { Batism } from '@domain/batism/Batism';
import { ChildrenRole } from '@domain/enums';
import bcrypt from 'bcryptjs';
import { MemberSummary } from '../member/Member';

export class Children extends User {
  constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public birthdate: Date = new Date(),
        public email: string = EMPTY,
        public phone: string = EMPTY,
        public groupId: string | null = null,
        public batism: Batism | null = null,
        public parent: MemberSummary[] = [],
        public role: ChildrenRole = ChildrenRole.EMPTY,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
        password: string = 'IgrejaIAF'
    ) {
        super(id, name, phone, password, createdAt);
    }

    static fromJson(json: any): Children {
        return new Children(
            json.id,
            json.name,
            new Date(json.birthdate),
            json.email,
            json.phone,
            json.groupId,
            json.batism,
            json.parent || [],
            json.role,
            json.isActive,
            json.createdAt
        );
    }
 
    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            birthdate: this.birthdate.toISOString(),
            email: this.email,
            phone: this.phone,
            groupId: this.groupId,
            batism: this.batism ?? null,
            parent: this.parent,
            role: this.role,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }

    async getPasswordHash(): Promise<string> {
        return bcrypt.hash(this.password, 10);
    }  
}

export class ChildrenSummary {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public phone: string = EMPTY,

    ) { }

    static fromJson(json: any): ChildrenSummary {
        return new ChildrenSummary(
            json.id,
            json.name ?? EMPTY,
            json.phone ?? null,
        );
    }

    toJSON(): object {
        return {
            userId: this.id,
            name: this.name,
            phone: this.phone,
        };
    }  
}

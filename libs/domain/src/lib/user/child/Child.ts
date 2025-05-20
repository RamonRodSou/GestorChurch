import { v4 as uuidv4 } from 'uuid';
import { User } from '../User';
import { EMPTY } from '@domain/utils/string-utils';
import { Batism } from '@domain/batism/Batism';
import { ChildRole } from '@domain/enums';
import bcrypt from 'bcryptjs';
import { MemberSummary } from '../member/Member';
import { AgeGroup } from '@domain/enums/AgeGroup';

export class Child extends User {
  constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public birthdate: Date = new Date(),
        public email: string = EMPTY,
        public phone: string = EMPTY,
        public groupId: string | null = null,
        public batism: Batism | null = null,
        public parents: MemberSummary[] = [],
        public role: ChildRole = ChildRole.EMPTY,
        public ageGroup: AgeGroup = AgeGroup.CHILD,
        public medication: string | null = null,
        public specialNeed : string | null = null,
        public allergy: string | null = null,
        public isImageAuthorized: boolean = true,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
        password: string = 'IgrejaIAF'
    ) {
        super(id, name, phone, password, createdAt);
    }

    static fromJson(json: any): Child {
        return new Child(
            json.id,
            json.name,
            new Date(json.birthdate),
            json.email,
            json.phone,
            json.groupId,
            json.batism,
            json.parents || [],
            json.role,
            json.ageGroup,
            json.medication,
            json.specialNeed,
            json.allergy,
            json.isImageAuthorized,
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
            parents: this.parents,
            role: this.role,
            ageGroup: this.ageGroup,
            medication: this.medication,
            specialNeed: this.specialNeed,
            allergy: this.allergy,
            isImageAuthorized: this.isImageAuthorized,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }

    async getPasswordHash(): Promise<string> {
        return bcrypt.hash(this.password, 10);
    }  
}

export class ChildSummary {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public phone: string = EMPTY,
    ) { }

    static fromJson(json: any): ChildSummary {
        return new ChildSummary(
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

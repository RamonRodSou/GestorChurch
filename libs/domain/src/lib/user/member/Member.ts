import { v4 as uuidv4 } from 'uuid';
import { User } from '../User';
import { EMPTY } from '@domain/utils/string-utils';
import { Batism } from '@domain/batism/Batism';
import { CivilStatus, Role } from '@domain/enums';
import { ILocation } from '@domain/interface/ILocation';
import bcrypt from 'bcryptjs';

export class Member extends User implements ILocation{
  constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public birthdate: Date = new Date(),
        public cpf: string = EMPTY,
        public email: string = EMPTY,
        public phone: string = EMPTY,
        public groupId: string | null = null,
        public street: string = EMPTY,
		public houseNumber: string = EMPTY,
		public city: string = EMPTY,
		public state: string = EMPTY,
		public zipCode: string = EMPTY,
		public neighborhood: string = EMPTY,
        public batism: Batism = new Batism(),
        public civilStatus: CivilStatus = CivilStatus.SINGLE,
        public spouse: MemberSummary | null = null,
        public children: MemberSummary[] = [],
        public role: Role = Role.MEMBER,
        public isActive: boolean = true,
		public createdAt: string = new Date().toISOString(),
        password: string = 'IgrejaIAF'
    ) {
		super(id, name, phone, password, createdAt);
    }

    static fromJson(json: any): Member {
        return new Member(
            json.id,
            json.name,
            new Date(json.birthdate),
            json.cpf,
            json.email,
            json.phone,
            json.groupId,
            json.street,
            json.houseNumber,
            json.city,
            json.state,
            json.zipCode, 
            json.neighborhood,
            json.batism,
            json.civilStatus,
            json.spouse,
            json.children || [],
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
            cpf: this.cpf,
            email: this.email,
            phone: this.phone,
            groupId: this.groupId,
            street: this.street,
            houseNumber: this.houseNumber,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode,
            neighborhood: this.neighborhood,
            batism: this.batism,
            civilStatus: this.civilStatus,
            spouse: this.spouse,
            children: this.children,
            role: this.role,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }

    async getPasswordHash(): Promise<string> {
        return bcrypt.hash(this.password, 10);
    }  
}

export class MemberSummary {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public email: string = EMPTY,
        public phone: string = EMPTY,

    ) { }

    static fromJson(json: any): MemberSummary {
        return new MemberSummary(
            json.id,
            json.name ?? EMPTY,
            json.email ?? null,
            json.phone ?? null,
        );
    }

    toJSON(): object {
        return {
            userId: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
        };
    }  
}

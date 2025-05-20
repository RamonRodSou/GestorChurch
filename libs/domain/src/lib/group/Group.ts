import { v4 as uuidv4 } from 'uuid';
import { EMPTY } from '@domain/utils/string-utils';
import { MemberSummary } from '@domain/user';
import { ILocation } from '@domain/interface';
import { WeekDays } from '@domain/enums';

export class Group implements ILocation {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public weekDay: WeekDays = WeekDays.THURSDAY,
        public street: string = EMPTY,
        public houseNumber: string = EMPTY,
        public city: string = EMPTY,
        public state: string = EMPTY,
        public zipCode: string = EMPTY,
        public neighborhood: string = EMPTY,
        public leaders: MemberSummary[] = [],
        public members: MemberSummary[] = [],
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString()
    ) { }

    static fromJson(json: any): Group {
        return new Group(
            json.id,
            json.name,
            json.weekDay,
            json.street,
            json.houseNumber,
            json.city,
            json.state,
            json.zipCode,
            json.neighborhood,
            (json.leaders || []).map(MemberSummary.fromJson),
            (json.members || []).map(MemberSummary.fromJson),
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            weekDay: this.weekDay,
            street: this.street,
            houseNumber: this.houseNumber,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode,
            neighborhood: this.neighborhood,
            leaders: this.leaders,
            members: this.members,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}

export class GroupSummary {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = EMPTY,
        public leaders: MemberSummary[] = [],
        public isActive: boolean = true
    ) {
    }

    static fromJson(json: any): GroupSummary {
        return new GroupSummary(
            json.id,
            json.name ?? EMPTY,
            json.leaders || [],
            json.isActive
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            leaders: this.leaders,
            isActive: this.isActive
        };
    }
}

import { Departament, TimePeriod, WeekDays } from "@domain/enums";
import { ChildSummary, MemberSummary } from "@domain/user";
import { v4 as uuidv4 } from 'uuid';

export class ServiceSchedule {
    constructor(
        public readonly id: string = uuidv4(),
        public departament: Departament | null = null,
        public date: Date = new Date(),
        public weekDay: WeekDays | null = null,
        public timePeriod: TimePeriod = TimePeriod.EVENING,
        public leader: MemberSummary | null = null,
        public members: MemberSummary[] = [],
        public childrens: ChildSummary[] = [],
        public observation: string | null = null,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString() 
    ) {}

    static fromJson(json: any): ServiceSchedule {
        return new ServiceSchedule(
            json.id,
            json.departament,
            new Date(json.date),
            json.weekDay,
            json.timePeriod,
            json.leader,
            json.members || [],
            json.childrens || [],
            json.observation,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            departament: this.departament,
            date: this.date.toISOString(),
            weekDay: this.weekDay,
            timePeriod: this.timePeriod,
            leader: this.leader,
            members: this.members, 
            childrens: this.childrens, 
            observation: this.observation,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
} 
import { v4 as uuidv4 } from 'uuid';
import { WeekDays } from '@domain/enums';
import { EMPTY } from '@domain/utils';
import { ChildSummary, MemberSummary } from '@domain/user';
import { VisitorGroup } from '@domain/user/visitor/VisitorGroup';

export class ReportGroup {
    constructor(
        public readonly id: string = uuidv4(),
        public groupId: string | null = null,
        public weekDay: WeekDays = WeekDays.THURSDAY,
        public time: string = EMPTY,
        public members: MemberSummary[] = [],
        public childrens: ChildSummary[] = [],
        public visitors: VisitorGroup[] = [],
        public value: number = 0,
        public observation: string | null = null,
        public isActive: boolean = true, 
        public createdAt: string = new Date().toISOString()
    ) { }

    static fromJson(json: any): ReportGroup {
 
        return new ReportGroup(
            json.id,
            json.groupId,
            json.weekDay,
            json.time,
            json.members || [],
            json.childrens || [],
            json.visitors || [],
            json.value,
            json.observation,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            groupId: this.groupId,
            weekDay: this.weekDay,
            time: this.time,
            members: this.members, 
            childrens: this.childrens, 
            visitors: this.visitors,
            observation: this.observation,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}

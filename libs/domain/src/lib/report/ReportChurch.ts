import { v4 as uuidv4 } from 'uuid';
import { WorshipType } from '@domain/enums';

export class ReportChurch {
    constructor(
        public readonly id: string = uuidv4(),
        public worship: WorshipType = WorshipType.SUNDAY_NIGHT,
        public totalPeople: number = 0,
        public totalChildren: number = 0,
        public totalVolunteers: number = 0,
        public decisionsForJesus: number = 0,
        public baptismCandidates: number = 0,
        public firstTimeVisitors: number = 0,
        public returningPeople: number = 0,
        public newMembers: number = 0,
        public peopleBaptizedThisMonth: number = 0,
        public observation: string | null = null,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString()
    ) { }

    static fromJson(json: any): ReportChurch {
        return new ReportChurch(
            json.id,
            json.worship,
            json.totalPeople,
            json.totalChildren,
            json.totalVolunteers,
            json.decisionsForJesus,
            json.baptismCandidates,
            json.firstTimeVisitors,
            json.returningPeople,
            json.newMembers,
            json.peopleBaptizedThisMonth,
            json.observation,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            totalPeople: this.totalPeople,
            totalChildren: this.totalChildren,
            totalVolunteers: this.totalVolunteers,
            decisionsForJesus: this.decisionsForJesus,
            baptismCandidates: this.baptismCandidates,
            firstTimeVisitors: this.firstTimeVisitors,
            returningPeople: this.returningPeople,
            newMembers: this.newMembers,
            peopleBaptizedThisMonth: this.peopleBaptizedThisMonth,
            observation: this.observation,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}

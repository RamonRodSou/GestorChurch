import { EMPTY } from "@domain/utils/string-utils";

export class Batism {
    constructor(
        public churchName: string = EMPTY,
        public ourChurch: boolean = true,
        public leaderName: string = EMPTY,
        public baptismDate: Date = new Date(),
    ) {}

    static fromJson(json: any): Batism {
        return new Batism(
            json.churchName,
            json.ourChurch,
            json.leaderName,
            new Date(json.baptismDate)     
        );
    }

    toJSON(): object {
        return {
            churchName: this.churchName,
            ourChurch: this.ourChurch,
            leaderName: this.leaderName,
            baptismDate: this.baptismDate.toISOString()
        };
    }
} 
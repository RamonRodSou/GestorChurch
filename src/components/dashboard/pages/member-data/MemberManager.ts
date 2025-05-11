import { MemberSummary } from "@domain/user";

export class MemberManager {
    public children: MemberSummary[] = [];

    public addChild(input: string | MemberSummary): void {
        const member = this.ensureMemberSummary(input);
        this.children.push(member);
    }

    public ensureMemberSummary(input: string | MemberSummary): MemberSummary {
        if (typeof input === 'string') {
            return new MemberSummary(undefined, input);
        }
        return input;
    }
}

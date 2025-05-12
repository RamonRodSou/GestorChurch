import { IncomeType } from '@domain/enums';
import { MemberSummary } from '@domain/user/member/Member';
import { EMPTY } from '@domain/utils/string-utils';
import { v4 as uuidv4 } from 'uuid';

export class Financial {
    constructor(
        public readonly id: string = uuidv4(),
        public member: MemberSummary = new MemberSummary(),
        public income: number = 0,
        public expense: number = 0,
        public createdAt: string = new Date().toISOString()
    ) { }

    get balance(): number {
        return this.income - this.expense;
    }

    static fromJson(json: any): Financial {
        return new Financial(
            json.id,
            MemberSummary.fromJson(json.member),
            json.income,
            json.expense,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            member: this.member,
            income: this.income,
            expense: this.expense,
            createdAt: this.createdAt,
        };
    }
}

export class FinancialSummary {
    constructor(
        public readonly id: string = uuidv4(),
        public income: number = 0,
        public incomeType: IncomeType | null,
        public expense: number = 0,
        public expenseType: string = EMPTY,
        public createdAt: string = new Date().toISOString()
    ) { }

    get balance(): number {
        return this.income - this.expense;
    }

    static fromJson(json: any): FinancialSummary {
        return new FinancialSummary(
            json.id,
            json.income,
            json.incomeType,
            json.expense,
            json.expenseType,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            income: this.income,
            incomeType: this.incomeType,
            expense: this.expense,
            expenseType: this.expenseType,
            createdAt: this.createdAt,
        };
    }
}

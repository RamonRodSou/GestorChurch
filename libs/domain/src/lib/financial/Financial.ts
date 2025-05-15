import { IncomeType, MoneyMovement } from '@domain/enums';
import { v4 as uuidv4 } from 'uuid';

export class Financial {
    constructor(
        public readonly id: string = uuidv4(),
        public type: MoneyMovement,
        public value: number,
        public description: string | IncomeType,
        public createdAt: string = new Date().toISOString()
    ) { }

    get isIncome(): boolean {
        return this.type === MoneyMovement.INCOME;
    }

    get isExpense(): boolean {
        return this.type === MoneyMovement.EXPENSE;
    }

    get balance(): number {
        return this.isIncome ? this.value : -this.value;
    }

    static fromJson(json: any): Financial {
        return new Financial(
            json.id,
            json.type,
            json.value,
            json.description,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            type: this.type,
            value: this.value,
            description: this.description,
            createdAt: this.createdAt,
        };
    }
}
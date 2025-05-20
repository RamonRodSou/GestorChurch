import { ChildSummary, MemberSummary } from "@domain/user";

export function ensureMemberSummary(input: unknown): MemberSummary {
    if (input instanceof MemberSummary) {
        return input;
    }

    if (typeof input === 'string') {
        return new MemberSummary(undefined, input.toUpperCase());
    }

    if (typeof input === 'object' && input !== null) {
        return MemberSummary.fromJson(input);
    }

    throw new Error('Valor inválido para MemberSummary');
}

export function ensureChildSummary(input: unknown): ChildSummary {
    if (input instanceof ChildSummary) {
        return input;
    }

    if (typeof input === 'string') {
        return new ChildSummary(undefined, input.toUpperCase());
    }

    if (typeof input === 'object' && input !== null) {
        return ChildSummary.fromJson(input);
    }

    throw new Error('Valor inválido para ChildrenSummary');
}

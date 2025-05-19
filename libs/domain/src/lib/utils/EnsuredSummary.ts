import { ChildrenSummary, MemberSummary } from "@domain/user";

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

export function ensureChildrenSummary(input: unknown): ChildrenSummary {
    if (input instanceof ChildrenSummary) {
        return input;
    }

    if (typeof input === 'string') {
        return new ChildrenSummary(undefined, input.toUpperCase());
    }

    if (typeof input === 'object' && input !== null) {
        return ChildrenSummary.fromJson(input);
    }

    throw new Error('Valor inválido para ChildrenSummary');
}

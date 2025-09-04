import { Child, Member, Visitor } from "@domain/user";
import { required, ValidationEntity } from "@domain/validate/validateForm";
import { Validate } from "@domain/validate/Validate";
import { VisitorGroup } from "@domain/user/visitor/VisitorGroup";
import { Guest } from "@domain/guest";

export function memberValidate(): ValidationEntity<Member> {
    return {
        name: [required("Nome é obrigatório.")],
        cpf: [Validate.cpfValidatorFn()],
        birthdate: [Validate.birthdateValidator(18)],
        phone: Validate.phoneValidator(),
        zipCode: [Validate.zipCodeValidator()],
        houseNumber: [Validate.houseNumberValidator()]
    };
}

export function visitorValidate(): ValidationEntity<Visitor> {
    return {
        name: [required("Nome é obrigatório.")],
        phone: Validate.phoneValidator(),
    };
}

export function visitorGroupValidate(): ValidationEntity<VisitorGroup> {
    return {
        name: [required("Nome é obrigatório.")],
        phone: Validate.phoneValidator(),
    };
}

export function visitorChiildValidate(): ValidationEntity<Child> {
    return {
        name: [required("Nome é obrigatório.")],
        birthdate: [Validate.birthdateValidator(2)],
    };
}

export function ticketValidate(): ValidationEntity<Guest> {
    return {
        name: [required("Nome é obrigatório.")],
        phone: Validate.phoneValidator(),
    };
}
import { Member } from "@domain/user";
import { EMPTY } from "./string-utils";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

interface Props {
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    member: Member;
}

export function validateMemberForm({ setErrors, member }: Props): boolean {
    const newErrors: { [key: string]: string } = {};

    if (!member.name || member.name.trim() === EMPTY) {
        newErrors.name = "Nome é obrigatório";
    }

    if (!member.cpf || !cpfValidator.isValid(member.cpf)) {
        newErrors.cpf = "CPF inválido";
    }

    if (!member.birthdate) {
        newErrors.birthDate = "Data de nascimento é obrigatória";
    } else {
        const birth = new Date(member.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 ||(monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 18) {
            newErrors.birthDate = "É necessário ter pelo menos 18 anos.";
        }
    }

    if (!member.phone || member.phone.length < 10) {
        newErrors.phone = "Telefone inválido";
    }

    if (!member.zipCode || member.zipCode.length < 8) {
        newErrors.zipCode = "CEP inválido";
    }

    if (!member.houseNumber) {
        newErrors.houseNumber = "Número é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}

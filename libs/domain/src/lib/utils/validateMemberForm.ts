import { Member } from "@domain/user";
import { EMPTY } from "./string-utils";

interface Props {
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    member: Member
}

export function validateMemberForm ({setErrors, member}:Props): boolean {

    const newErrors: { [key: string]: string } = {};

    if (!member.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!member.phone || member.phone.replace(/\D/g, EMPTY).length !== 11)
        newErrors.phone = "Telefone deve ter 11 dígitos.";
    if (!member.email || !/\S+@\S+\.\S+/.test(member.email))
        newErrors.email = "Email inválido.";
    if (!member.zipCode || member.zipCode.length !== 8)
        newErrors.zipCode = "CEP deve ter 8 dígitos.";
    if (!member.street) newErrors.street = "Rua é obrigatória.";
    if (!member.houseNumber) newErrors.houseNumber = "Número é obrigatório.";
    if (!member.state) newErrors.state = "Estado é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
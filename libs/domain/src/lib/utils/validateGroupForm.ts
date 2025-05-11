import { Group } from "@domain/group";

interface Props {
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    group: Group
}

export function validateGroupForm ({setErrors, group}:Props): boolean {

    const newErrors: { [key: string]: string } = {};

    if (!group.name.trim()) newErrors.name = "Nome do grupo é obrigatório.";
    if (!group.zipCode || group.zipCode.length !== 8)
        newErrors.zipCode = "CEP deve ter 8 dígitos.";
    if (!group.houseNumber) newErrors.houseNumber = "Número é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
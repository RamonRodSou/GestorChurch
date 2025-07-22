import { ILocation } from "@domain/interface";
import { maxLength, minLength, required } from "./validateForm";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import ICepData from "@domain/interface/ICepData";
import { EMPTY } from "@domain/utils";

interface Props<T> {
    setData: React.Dispatch<React.SetStateAction<ILocation | any>>,
    cepData: ICepData | null,
    data: {
        fromJson: (data: any) => T;
    };
}

export class Validate {
    static phoneValidator() {
        return [
            required("Telefone é obrigatório."),
            minLength(10, "Telefone deve ter no minimo 9 digitos."),
            maxLength(11, "Telefone deve ter no máximo 11 digitos.")
        ];
    }
    static cpfValidatorFn(msg: string = "CPF inválido.") {
        return (val: string) =>
            !val || !cpfValidator.isValid(val) ? msg : null;
    }

    static birthdateValidator(minAge: number) {
        return (val: string): string | null => {
            if (!val) return "Data de nascimento é obrigatória.";

            const birth = new Date(val);
            const today = new Date();

            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }

            return age < minAge ? `É necessário ter pelo menos ${minAge} anos.` : null;
        };
    }

    static houseNumberValidator() {
        return required("Número é obrigatório.")
    }

    static zipCodeValidator() {
        return minLength(8, "CEP inválido.")
    }

    static CEP<T>({ setData, cepData, data }: Props<T>) {
        if (cepData) {
            setData((prev: any) => {
                const updated = {
                    ...prev,
                    street: cepData.logradouro.toUpperCase() ?? EMPTY,
                    city: cepData.localidade.toUpperCase() ?? EMPTY,
                    state: cepData.uf.toUpperCase() ?? EMPTY,
                    neighborhood: cepData.bairro.toUpperCase() ?? EMPTY
                };
                return data.fromJson(updated);
            });
        }
    }
}
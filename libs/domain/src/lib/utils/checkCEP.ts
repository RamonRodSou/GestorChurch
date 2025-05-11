import fetchCepData from "@service/CepService";
import { EMPTY } from "./string-utils";
import ICepData from "@domain/interface/ICepData";

interface Props {
    it: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    setCepData: React.Dispatch<React.SetStateAction<ICepData | null>>
}

export function checkCEP ({it, setCepData}: Props) {
    const cep = it.target.value.replace(/\D/g, EMPTY);
    if (cep.length === 8) {
        fetchCepData({ cep, setCep: setCepData });
    }
};
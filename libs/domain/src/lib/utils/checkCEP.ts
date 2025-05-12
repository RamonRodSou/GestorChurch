import fetchCepData from "@service/CepService";
import { EMPTY } from "./string-utils";
import ICepData from "@domain/interface/ICepData";

interface Props {
    it: string,
    setCepData: React.Dispatch<React.SetStateAction<ICepData | null>>
}

export function checkCEP ({it, setCepData}: Props) {
    const cep = it.replace(/\D/g, EMPTY)
    if (cep.length === 8) {
        fetchCepData({ cep: cep, setCep: setCepData });
    }
};
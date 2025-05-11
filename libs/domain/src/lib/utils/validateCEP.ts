import { ILocation } from "@domain/interface";
import { Member } from "@domain/user";
import ICepData from "@domain/interface/ICepData";
import { EMPTY } from "./string-utils";

interface Props {
    setData: React.Dispatch<React.SetStateAction<ILocation | any>>;
    cepData: ICepData | null
}

export default function validateCEP({setData, cepData}:Props) {
    if (cepData) {
        setData((prev: any) => {
            const updated = {
                ...prev,
                street: cepData.logradouro.toUpperCase() ?? EMPTY,
                city: cepData.localidade.toUpperCase() ?? EMPTY,
                state: cepData.uf.toUpperCase() ?? EMPTY,
                neighborhood: cepData.bairro.toUpperCase() ?? EMPTY
            };
            return Member.fromJson(updated);
        });
    }
}
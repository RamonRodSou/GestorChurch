import axios from 'axios';
import ICepData from '../../libs/domain/src/lib/interface/ICepData';

interface Props {
    setCep(data: ICepData): void;
    cep: string;
}

export default async function fetchCepData({ setCep, cep }: Props): Promise<void> {
    try {
      const response = await axios.get<ICepData>(`https://viacep.com.br/ws/${cep}/json`);
      if (response.data.erro) {
          console.error('CEP not found.');
      } else {
          setCep(response.data);
      }
    } catch (error) {
        console.error('Error fetching CEP data:', error);
    }
}

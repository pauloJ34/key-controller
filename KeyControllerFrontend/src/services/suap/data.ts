import { suapApi } from '.';
import { UserModel } from "@/models";

export interface SuapUser {
  id: number;
  matricula: string;
  nome_usual: string;
  tipo_vinculo: string;
}

export const getSuapUser = async (token: string) => {
  // const response = await suapApi.get<SuapUser>('minhas-informacoes/meus-dados/', {
    const response = await suapApi.get<UserModel>('user/data', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

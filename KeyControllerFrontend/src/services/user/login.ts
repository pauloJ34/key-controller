import { api } from '../api';
import { SuapUser } from '../suap/data';
import { UserModel } from "@/models";

export const userLoginService = async (user: UserModel) => {
  const response = await api.post<{ token: string }>('/user/login', {
    // registry: user.matricula,
    // username: user.nome_usual,
    // type: user.tipo_vinculo,
    registry: user.registry,
    username: user.name,
    type: user.type,
  });

  return response.data;
};

import { useAuth } from "@/hooks";
import { KeyInUseModel, UserType } from "@/models";
import { keyService } from "@/services/key";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Container } from "./styles";
import { formatDate } from "@/helpers";
import { Alert } from "@/utils";
import theme from "@/styles/theme";
import { scheduleService } from "@/services/schedule";

const userType = {
  STUDENT: 'Aluno',
  SERVER: 'Servidor',
  ADMIN: 'Administrador'
} as { [key in UserType]: string }

export const UserData: React.FC = () => {
  const [key, setKey] = useState<KeyInUseModel | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  function returnKey() {
    if (!key || loading) return;
    setLoading(true);

    Alert.fire({
      title: 'Devolver chave?',
      description: `Deseja realmente devolver a chave ${key.keyNumber}?`,
      confirm: { label: 'Confirmar' },
      cancel: { label: 'Cancelar', color: theme["danger-500"] },
      onConfirm: async () => {
        try {
          await scheduleService.return(key.id);
          setKey(null);

          toast.success('Chave devolvida!');
        } catch (error) {
          toast.error('Não foi possível devolver a chave!');
        } finally {
          setLoading(false)
        }
      }
    })
  }

  function renderCurrentKey() {
    if (!key) return null;

    return (
      <div className="form">
        <h5 className="text">Chave atual:</h5>

        <label className="input__wrapper" htmlFor="key_number">
          Número
          <input id="key_number" type="text" className="form__input" value={key.keyNumber} disabled />
        </label>

        <label className="input__wrapper" htmlFor="sector">
          Setor
          <input id="sector" type="text" className="form__input" value={key.sectorName} disabled />
        </label>

        <label className="input__wrapper" htmlFor="acquisition_date">
          Data da aquisição
          <input id="acquisition_date" type="text" className="form__input" value={formatDate(key.acquisitionDate)} disabled />
        </label>

        <button className="form__button" onClick={returnKey} disabled={loading}>
          {loading ? 'Carregando...' : 'Devolver'}
        </button>
      </div>
    )
  }

  useEffect(() => {
    if (user) {
      keyService.inUse()
        .then(setKey)
        .catch(() => toast.error('Não foi possível pegar a sua chave atual!', { id: 'key-in-use' }))
    }
  }, [user]);

  return (
    <Container>
      <div className="form user__data">
        <label className="input__wrapper" htmlFor="name">
          Nome
          <input id="name" type="text" className="form__input" value={user?.name} disabled />
        </label>

        <label className="input__wrapper" htmlFor="registry">
          Matrícula
          <input id="registry" type="text" className="form__input" value={user?.registry} disabled />
        </label>

        <label className="input__wrapper" htmlFor="type">
          Tipo de usuário
          <input id="type" type="text" className="form__input" value={user?.type ? userType[user.type] : '-'} disabled />
        </label>
      </div>

      {renderCurrentKey()}
    </Container>
  )
}
import { ModalAside } from "@/components";
import { formatDate } from "@/helpers";
import { useAuth } from "@/hooks";
import { ScheduleModel } from "@/models";
import { scheduleService } from "@/services/schedule";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  close(): void;
}

export const ConfirmKeyReturnModal: React.FC<Props> = ({ isOpen, close }) => {
  const [schedules, setSchedules] = useState([] as ScheduleModel[]);

  const { user } = useAuth();

  const confirmReturn = async (id: number, returned: boolean) => {
    try {
      await scheduleService.confirmReturn(id, returned);
      const message = returned ? "Retorno confirmado!" : "Retorno não realizado!"

      toast.success(message, { id: "returned-key" });
      await listSchedules();
    } catch (error) {
      toast.error("Não possível confirmar o retorno!");
    }
  }

  const listSchedules = useCallback(() => {
    return scheduleService.history({ currentPage: 0, pageSize: 100, notReturned: true }).then((result) => setSchedules(result.content))
  }, [])

  useEffect(() => {
    if (user && user.type === 'ADMIN') {
      listSchedules()
    }
  }, [user, listSchedules])

  return (
    <ModalAside
      isOpen={isOpen}
      close={close}
      title="Confirmar retorno das chaves"
    >
      {schedules.map((s) => (
        <div className="form" key={s.id}>
          <label className="input__wrapper">
            Usuário
            <input type="text" className="form__input" value={s.user.name} disabled />
          </label>

          <div className="form__row">
            <label className="input__wrapper">
              N° da chave
              <input type="text" className="form__input" value={s.key.id} disabled />
            </label>

            <label className="input__wrapper">
              Setor
              <input type="text" className="form__input" value={s.key.sector.name} disabled />
            </label>
          </div>

          <div className="form__row">
            <label className="input__wrapper" >
              Data de aquisição
              <input
                type="text"
                className="form__input"
                value={formatDate(s.acquisitionDate)}
                disabled
              />
            </label>

            <label className="input__wrapper">
              Data de devolução
              <input
                type="text"
                className="form__input"
                value={formatDate(s.devolutionDate)}
                disabled
              />
            </label>
          </div>

          <div className="form__row">
            <button className="form__button" onClick={() => confirmReturn(s.id, true)}>Entregue</button>
            <button className="form__button" onClick={() => confirmReturn(s.id, false)}>Não devolveu</button>
          </div>

          <hr />
        </div>
      ))}
    </ModalAside>
  )
}
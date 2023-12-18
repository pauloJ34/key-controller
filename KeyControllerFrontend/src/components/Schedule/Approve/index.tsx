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
  onApprove(): void;
}

export const ApproveScheduleModal: React.FC<Props> = ({ isOpen, close, onApprove }) => {
  const [schedules, setSchedules] = useState([] as ScheduleModel[]);

  const { user } = useAuth();

  const approve = async (id: number, approved: boolean) => {
    try {
      await scheduleService.approve(id, approved);
      const message = approved ? "Agendamento aprovado!" : "Agendamento negado!"

      toast.success(message, { id: "approved-key" });
      await listSchedules();
      onApprove();
    } catch (error) {
      toast.error("Não possível aprovar o agendamento!");
    }
  }

  const listSchedules = useCallback(() => {
    return scheduleService.history({ currentPage: 0, pageSize: 100, notConfirmed: true }).then((result) => setSchedules(result.content))
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
      title="Aprovar agendamentos"
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
              <input type="text" className="form__input" value={s.key.number} disabled />
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
            <button className="form__button" onClick={() => approve(s.id, true)}>Aprovar</button>
            <button className="form__button" onClick={() => approve(s.id, false)}>Negar</button>
          </div>

          <hr />
        </div>
      ))}
    </ModalAside>
  )
}
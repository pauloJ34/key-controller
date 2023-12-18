import { ModalAside } from "@/components";
import { useAuth, useData } from "@/hooks";
import { KeyModel } from "@/models";
import { keyService } from "@/services/key";
import { scheduleService } from "@/services/schedule";
import { ApiError } from "@/types/ApiError";
import { createScheduleValidation } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormTypes {
  sectorId: number;
  keyId: number;
  acquisitionDate: Date;
  devolutionDate: Date;
}

interface Props {
  isOpen: boolean;
  close(): void;
  onCreate(): void;
}

export const CreateScheduleModal: React.FC<Props> = ({ isOpen, close, onCreate }) => {
  const { sectors } = useData();
  const { user } = useAuth();
  const [keys, setKeys] = useState([] as KeyModel[]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormTypes>({
    resolver: zodResolver(createScheduleValidation)
  })
  const [loading, setLoading] = useState(false);

  const createSchedule = async (data: FormTypes) => {
    if (loading) return;
    setLoading(true);

    try {
      await scheduleService.create(data);
      toast.success(user?.type === 'STUDENT' ? 'Agendamento solicitado' : 'Agendamento realizado');

      reset();
      onCreate();
    } catch (error) {
      const message = (error as ApiError).response?.data.message || '';

      if (message == 'Schedule conflict') {
        toast.error('Conflito com outro  agendamento!', { id: "schedule conflict" });
        return;
      }

      if (message == 'You cant have multiple schedules at same time') {
        toast.error('Você já possui outro agendamento dentro destes horários', { id: "schedule-already-exists" });
        return;
      }

      toast.error('Não foi possível registrar o agendamento!', { id: "schedule error" });
    } finally {
      setLoading(false);
    }
  }

  const findKeys = async (sectorId: string) => {
    if (!sectorId) {
      setKeys([]);
      return;
    };

    try {
      const result = await keyService.listBySector(sectorId);
      setKeys(result);
      reset({ keyId: undefined });
    } catch (error) {
      toast.error('Não foi possível buscar as chaves!')
    }
  }

  return (
    <ModalAside
      isOpen={isOpen}
      close={close}
      title={user?.type === 'STUDENT' ? 'Solicitar agendamento' : 'Agendar chave'}
    >
      <form className="form" onSubmit={handleSubmit(createSchedule)}>
        <label className={`input__wrapper ${!!errors.sectorId && 'input__error'}`} htmlFor="sectorId">
          Setor
          <select id="sectorId" className="form__input text" {...register('sectorId')} onChange={(e) => findKeys(e.target.value)}>
            <option value="">Informe o setor</option>
            {sectors.map(((sector) => (
              <option key={sector.id} value={sector.id}>{sector.name}</option>
            )))}
          </select>
        </label>

        <label className={`input__wrapper ${!!errors.keyId && 'input__error'}`} htmlFor="keyId">
          Chave
          <select id="keyId" className="form__input text" {...register("keyId")}>
            <option value="">Selecione a chave</option>
            {keys.map(((key) => (
              <option key={key.id} value={key.id}>{key.number}</option>
            )))}
          </select>
        </label>

        <label className={`input__wrapper ${!!errors.acquisitionDate && 'input__error'}`} htmlFor="acquisitionDate">
          Horário de uso
          <input id="acquisitionDate" type="datetime-local" className="form__input" {...register("acquisitionDate")} />
        </label>

        <label className={`input__wrapper ${!!errors.devolutionDate && 'input__error'}`} htmlFor="devolutionDate">
          Horário da entrega
          <input id="devolutionDate" type="datetime-local" className="form__input" {...register("devolutionDate")} />
        </label>

        <button className="form__button" disabled={loading}>
          {user?.type === 'STUDENT' ? 'Solicitar' : 'Agendar'}
        </button>
      </form>
    </ModalAside>
  )
}
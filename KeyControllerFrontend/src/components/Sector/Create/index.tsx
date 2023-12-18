import { ModalAside } from "@/components";
import { useData } from "@/hooks";
import { sectorService } from "@/services/sector";
import { createSectorValidation } from "@/validations/sector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormTypes {
  name: string;
}

interface Props {
  isOpen: boolean;
  close(): void;
  onCreate(): void;
}

export const CreateSectorModal: React.FC<Props> = ({ isOpen, close, onCreate }) => {
  const { fetchSectors } = useData();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormTypes>({
    resolver: zodResolver(createSectorValidation)
  })
  const [loading, setLoading] = useState(false);

  const createSector = async (data: FormTypes) => {
    if (loading) return;
    setLoading(true);

    try {
      await sectorService.create(data.name);
      await fetchSectors();
      reset();
      onCreate();
    } catch (error) {
      toast.error('Não foi possível criar o setor!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalAside
      isOpen={isOpen}
      close={close}
      title="Cadastrar setor"
    >
      <form className="form" onSubmit={handleSubmit(createSector)}>
        <label className={`input__wrapper ${!!errors.name && 'input__error'}`} htmlFor="name">
          Nome
          <input id="name" type="text" className="form__input" placeholder="Digite o nome do setor" {...register('name')} />
        </label>

        <button className="form__button" disabled={loading}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </button>
      </form>
    </ModalAside>
  )
}
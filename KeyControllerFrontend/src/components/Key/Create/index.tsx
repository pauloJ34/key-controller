import { ModalAside } from "@/components";
import { useData } from "@/hooks";
import { keyService } from "@/services/key";
import { createKeyValidation } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormTypes {
  number: string;
  sectorId: number;
}

interface Props {
  isOpen: boolean;
  close(): void;
  onCreate(): void;
}

export const CreateKeyModal: React.FC<Props> = ({ isOpen, close, onCreate }) => {
  const { sectors } = useData();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormTypes>({
    resolver: zodResolver(createKeyValidation)
  })
  const [loading, setLoading] = useState(false);

  const createKey = async (data: FormTypes) => {
    if (loading) return;
    setLoading(true);

    try {
      await keyService.create(data);
      reset();
      onCreate();
    } catch (error) {
      toast.error('Não foi possível criar a chave!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalAside
      isOpen={isOpen}
      close={close}
      title="Cadastrar chave"
    >
      <form className="form" onSubmit={handleSubmit(createKey)}>
        <label className={`input__wrapper ${!!errors.number && 'input__error'}`} htmlFor="number">
          Número
          <input id="number" type="text" className="form__input" placeholder="Digite o número da chave" {...register('number')} />
        </label>

        <label className={`input__wrapper ${!!errors.sectorId && 'input__error'}`} htmlFor="sectorId">
          Setor
          <select id="sectorId" className="form__input text" {...register('sectorId')}>
            <option value="">Informe o setor</option>
            {sectors.map(((sector) => (
              <option key={sector.id} value={sector.id}>{sector.name}</option>
            )))}
          </select>
        </label>

        <button className="form__button" disabled={loading}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </button>
      </form>
    </ModalAside>
  )
}
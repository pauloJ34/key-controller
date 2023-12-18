import { ModalAside } from "@/components";
import { useData } from "@/hooks";
import { KeyModel } from "@/models";
import { keyService } from "@/services/key";
import { updateKeyValidation } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormTypes {
  number: string;
  sectorId: number;
}

interface Props {
  keyForEdit?: KeyModel
  isOpen: boolean;
  close(): void;
  onEdit(): void;
}

export const EditKeyModal: React.FC<Props> = ({ keyForEdit: keyForEdit, isOpen, close, onEdit }) => {
  const { sectors } = useData();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormTypes>({
    resolver: zodResolver(updateKeyValidation)
  })
  const [loading, setLoading] = useState(false);

  const editKey = async (data: FormTypes) => {
    if (loading || !keyForEdit) return;
    setLoading(true);

    try {
      await keyService.edit({ id: keyForEdit.id, ...data });
      toast.success("Chave editada!")

      reset();
      onEdit();
    } catch (error) {
      toast.error('Não foi possível editar a chave!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reset(keyForEdit) }, [keyForEdit, reset]);

  return (
    <ModalAside
      isOpen={isOpen}
      close={close}
      title="Editar chave"
    >
      <form className="form" onSubmit={handleSubmit(editKey)}>
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
          {loading ? 'Carregando...' : 'Editar'}
        </button>
      </form>
    </ModalAside>
  )
}
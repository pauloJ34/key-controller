import { ModalAside } from "@/components";
import { SectorModel } from "@/models";
import { sectorService } from "@/services/sector";
import { updateSectorValidation } from "@/validations/sector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormTypes {
  name: string;
}

interface Props {
  sectorForEdit?: SectorModel
  isOpen: boolean;
  close(): void;
  onEdit(): void;
}

export const EditSectorModal: React.FC<Props> = ({ sectorForEdit, isOpen, close, onEdit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormTypes>({
    resolver: zodResolver(updateSectorValidation)
  })
  const [loading, setLoading] = useState(false);

  const editSector = async (data: FormTypes) => {
    if (loading || !sectorForEdit) return;
    setLoading(true);

    try {
      await sectorService.edit({ id: sectorForEdit.id, ...data });
      toast.success("Setor editado!");

      reset();
      onEdit();
    } catch (error) {
      toast.error('Não foi possível editar o setor!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reset(sectorForEdit) }, [sectorForEdit, reset]);

  return (
    <ModalAside
      isOpen={isOpen}
      close={close}
      title="Editar setor"
    >
      <form className="form" onSubmit={handleSubmit(editSector)}>
        <label className={`input__wrapper ${!!errors.name && 'input__error'}`} htmlFor="name">
          Nome
          <input id="name" type="text" className="form__input" placeholder="Digite o nome do setor" {...register('name')} />
        </label>

        <button className="form__button" disabled={loading}>
          {loading ? 'Carregando...' : 'Editar'}
        </button>
      </form>
    </ModalAside>
  )
}
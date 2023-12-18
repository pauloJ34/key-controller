import { MaterialSymbol, Modal, Table } from "@/components";
import { DropdownMenu } from "@/components/Dropdown";
import { CreateKeyModal, EditKeyModal } from "@/components/Key";
import { useAuth, useData } from "@/hooks";
import { KeyModel } from "@/models";
import { keyService } from "@/services/key";
import theme from "@/styles/theme";
import { ApiError } from "@/types/ApiError";
import { Alert } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const HomePage: React.FC = () => {
  const { sectors } = useData();
  const { ensureAuth } = useAuth();

  const [keys, setKeys] = useState<Array<KeyModel>>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(1);
  const [search, setSearch] = useState('');

  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [isFilterKeyOpen, setIsFilterKeyOpen] = useState(false);
  const [editKey, setEditKey] = useState<KeyModel>();

  const filterForm = useForm();

  const listKeys = useCallback(async (sectorId?: number, busy?: string) => {
    try {
      const data = await keyService.list({ currentPage, pageSize: 10, search, sectorId, busy });

      setKeys(data.content);
      setPagesCount(data.totalPages);
    } catch (error) {
      toast.error('Não foi possível buscar as chaves!')
    }
  }, [currentPage, search]);

  function filter(data: { status?: string, sector?: string }) {
    const { sector, status } = data;

    const sectorId = sector ? Number(sector) : undefined;

    listKeys(sectorId, status ?? undefined);
    setIsFilterKeyOpen(false);
  }

  function clearFilter() {
    filterForm.reset({ status: '', sector: '' });
    setIsFilterKeyOpen(false);
    listKeys();
  }

  const mapKeys = useCallback(() => {
    return keys.map((key) => ({
      number: key.number.toString(),
      sector: key.sectorName,
      busy: key.busy ? 'sim' : 'não',
      action: <DropdownMenu
        label={<MaterialSymbol name="more_vert" />}
        elements={[
          { icon: <MaterialSymbol name="bookmark" />, label: 'pegar', action: ensureAuth(() => takeKey(key), ['ADMIN', 'SERVER']) },
          { icon: <MaterialSymbol name="edit" />, label: 'editar', action: ensureAuth(() => setEditKey(key), ['ADMIN']) },
          { icon: <MaterialSymbol name="delete" />, label: 'deletar', action: ensureAuth(() => deleteKey(key), ['ADMIN']) }
        ]}
      />
    }))
  }, [keys, ensureAuth])

  const deleteKey = (key: KeyModel) => {
    Alert.fire({
      title: 'Deletar chave?',
      description: `Deseja realmente deletar a chave ${key.number}?`,
      confirm: { label: 'Confirmar', color: theme["danger-500"] },
      cancel: { label: 'Cancelar' },
      onConfirm: async () => {
        try {
          await keyService.delete(key.id);
          await listKeys();

          filterForm.reset();
          toast.success('Chave deletada!');
        } catch (error) {
          toast.error('Não foi possível deletar a chave!')
        }
      }
    })
  }

  const takeKey = (key: KeyModel) => {
    if (key.busy) {
      toast.error("Chave indisponível");
      return;
    }

    Alert.fire({
      title: 'Pegar chave?',
      description: `Deseja realmente pegar a chave ${key.number}?`,
      confirm: { label: 'Confirmar' },
      cancel: { label: 'Cancelar', color: theme["danger-500"] },
      onConfirm: async () => {
        try {
          await keyService.take(key.id);
          await listKeys();

          filterForm.reset();
          toast.success('Chave adiquirida!');
        } catch (error) {
          const errorMessage = (error as ApiError).response?.data.message || '';

          if (errorMessage === 'Key is busy') {
            toast.error('Chave indisponível');
            listKeys();
            return;
          }

          if (errorMessage === 'You cant have two keys at same time') {
            toast.error('Você não pode ter duas chaves ao mesmo tempo!');
            return;
          }

          toast.error('Não foi possível pegar a chave!')
        }
      }
    })
  }

  useEffect(() => { listKeys() }, [listKeys]);

  return (
    <>
      <CreateKeyModal
        isOpen={isCreateKeyOpen}
        close={() => setIsCreateKeyOpen(false)}
        onCreate={() => {
          listKeys();
          filterForm.reset();
          setIsCreateKeyOpen(false);
        }}
      />

      <EditKeyModal
        keyForEdit={editKey as KeyModel}
        isOpen={!!editKey}
        close={() => setEditKey(undefined)}
        onEdit={() => {
          listKeys();
          setEditKey(undefined);
        }}
      />

      <Modal
        isOpen={isFilterKeyOpen}
        close={() => setIsFilterKeyOpen(false)}
        title="Filtrar chaves"
      >
        <form onSubmit={filterForm.handleSubmit(filter)}>
          <label className="input__wrapper" htmlFor="status">
            Status
            <select id="status" className="form__input text" {...filterForm.register('status')}>
              <option value="">Selecione o status</option>
              <option value="false">Livre</option>
              <option value="true">Ocupado</option>
            </select>
          </label>

          <label className="input__wrapper" htmlFor="sector">
            Setor
            <select id="sector" className="form__input text" {...filterForm.register('sector')}>
              <option value="">Informe o setor</option>
              {sectors.map(((sector) => (
                <option key={sector.id} value={sector.id}>{sector.name}</option>
              )))}
            </select>
          </label>

          <div className="form__row">
            <button className="form__button">Filtrar</button>
            <button className="form__button" type="button" onClick={clearFilter}>Limpar</button>
          </div>
        </form>
      </Modal>

      <Table
        header={{
          title: 'Chaves',
          search: true,
          onSearch: setSearch,
          actions: [
            { icon: <MaterialSymbol name="filter_alt" />, onClick: () => setIsFilterKeyOpen(true) },
            { icon: <MaterialSymbol name="add" />, onClick: ensureAuth(() => setIsCreateKeyOpen(true), ['ADMIN']) },
          ]
        }}
        head={
          <Table.Head
            columns={[
              { label: 'número', size: '1fr', minSize: '6rem' },
              { label: 'setor', size: '1fr', minSize: '6rem' },
              { label: 'ocupado', size: '10rem', minSize: '6rem' },
              { label: 'ações', size: '4rem', minSize: '4rem' },
            ]}
          />
        }
        body={
          <Table.Body
            columns={[
              { field: 'number', size: '1fr', minSize: '6rem' },
              { field: 'sector', size: '1fr', minSize: '6rem' },
              { field: 'busy', size: '10rem', minSize: '6rem' },
              { field: 'action', size: '4rem', minSize: '4rem' },
            ]}
            rows={mapKeys()}
          />
        }
        pagination={{
          pages: pagesCount,
          current: currentPage,
          onPageChange: setCurrentPage
        }}
      />
    </>
  )
}

import { DropdownMenu, MaterialSymbol, Table } from "@/components"
import { CreateSectorModal, EditSectorModal } from "@/components/Sector";
import { useAuth } from "@/hooks";
import { SectorModel } from "@/models";
import { sectorService } from "@/services/sector";
import theme from "@/styles/theme";
import { Alert } from "@/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const SectorsPage: React.FC = () => {
  const [sectors, setSectors] = useState<SectorModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(1);
  const [search, setSearch] = useState('');

  const { ensureAuth, user } = useAuth();
  const [isCreateSectorOpen, setIsCreateSectorOpen] = useState(false);
  const [editSector, setEditSector] = useState<SectorModel>();

  const actions = useMemo(() => {
    if (!user || user.type !== 'ADMIN') return [];

    return [
      { icon: <MaterialSymbol name="add" />, onClick: ensureAuth(() => setIsCreateSectorOpen(true), ['ADMIN']) },
    ]
  }, [user]);

  const listSectors = useCallback(async () => {
    try {
      const data = await sectorService.list({ currentPage, pageSize: 10, search });

      setSectors(data.content);
      setPagesCount(data.totalPages);

    } catch (error) {
      toast.error('Não foi possível buscar os setores!')
    }
  }, [currentPage, search]);

  const deleteSector = (sector: SectorModel) => {
    Alert.fire({
      title: 'Deletar setor?',
      description: `Deseja realmente deletar o setor ${sector.name}?`,
      confirm: { label: 'Confirmar', color: theme["danger-500"] },
      cancel: { label: 'Cancelar' },
      onConfirm: async () => {
        try {
          await sectorService.delete(sector.id);
          await listSectors();

          toast.success('Setor deletada!');
        } catch (error) {
          toast.error('Não foi possível deletar o setor!', { id: 'delete-sector' })
        }
      }
    })
  }

  const mapSectors = useCallback(() => {
    return sectors.map((sector) => ({
      name: sector.name,
      action: <DropdownMenu
        label={<MaterialSymbol name="more_vert" />}
        elements={[
          { icon: <MaterialSymbol name="edit" />, label: 'editar', action: ensureAuth(() => setEditSector(sector), ['ADMIN']) },
          { icon: <MaterialSymbol name="delete" />, label: 'deletar', action: ensureAuth(() => deleteSector(sector), ['ADMIN']) }
        ]}
      />
    }))
  }, [sectors, ensureAuth]);

  useEffect(() => { listSectors() }, [listSectors]);

  return (
    <>
      <CreateSectorModal
        isOpen={isCreateSectorOpen}
        close={() => setIsCreateSectorOpen(false)}
        onCreate={() => {
          listSectors()
          setIsCreateSectorOpen(false)
        }}
      />

      <EditSectorModal
        sectorForEdit={editSector}
        isOpen={!!editSector}
        close={() => setEditSector(undefined)}
        onEdit={() => {
          listSectors();
          setEditSector(undefined);
        }}
      />

      <Table
        header={{
          title: 'Setores',
          search: true,
          onSearch: setSearch,
          actions
        }}
        head={
          <Table.Head
            columns={[
              { label: 'nome', size: '1fr', minSize: '6rem' },
              { label: 'ações', size: '4rem', minSize: '4rem' },
            ]}
          />
        }
        body={
          <Table.Body
            columns={[
              { field: 'name', size: '1fr', minSize: '6rem' },
              { field: 'action', size: '4rem', minSize: '4rem' },
            ]}
            rows={mapSectors()}
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
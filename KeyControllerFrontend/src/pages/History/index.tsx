import { MaterialSymbol, Table } from "@/components";
import { ApproveScheduleModal, ConfirmKeyReturnModal } from "@/components/Schedule";
import { formatDate } from "@/helpers";
import { useAuth } from "@/hooks";
import { ScheduleModel } from "@/models";
import { scheduleService } from "@/services/schedule";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const HistoryPage: React.FC = () => {
  const [registers, setRegisters] = useState<Array<ScheduleModel>>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(1);

  const [confirmKeyReturn, setConfirmKeyReturn] = useState(false)
  const [approveSchedules, setApprovedSchedules] = useState(false)

  const { ensureAuth, user } = useAuth();

  const actions = useMemo(() => {
    if (user?.type !== "ADMIN") return [];

    return [
      { icon: <MaterialSymbol name="event_available" />, onClick: ensureAuth(() => setApprovedSchedules(true)) },
      { icon: <MaterialSymbol name="key" />, onClick: ensureAuth(() => setConfirmKeyReturn(true)) }
    ]
  }, [user])

  const listKeyRegister = useCallback(async () => {
    try {
      const data = await scheduleService.history({ currentPage, pageSize: 10 });

      setRegisters(data.content);
      setPagesCount(data.totalPages);
    } catch (error) {
      toast.error('Não foi possível buscar o histórico!')
    }
  }, [currentPage]);

  const mapKeyRegister = useCallback(() => {
    return registers.map((register) => ({
      number: register.key.number,
      sector: register.key.sector.name,
      user: register.user.name,
      acquisition: formatDate(register.acquisitionDate),
      devolution: register.devolutionDate ? formatDate(register.devolutionDate) : '-'
    }))
  }, [registers, ensureAuth])

  useEffect(() => { listKeyRegister() }, [listKeyRegister]);

  return (
    <>
      <Table
        header={{
          title: 'Histórico',
          actions
        }}
        head={
          <Table.Head
            columns={[
              { label: 'número da chave', size: '1fr', minSize: '6rem' },
              { label: 'setor', size: '1fr', minSize: '6rem' },
              { label: 'usuário', size: '1fr', minSize: '10rem' },
              { label: 'aquisição', size: '10rem', minSize: '6rem' },
              { label: 'devolução', size: '10rem', minSize: '6rem' },
            ]}
          />
        }
        body={
          <Table.Body
            columns={[
              { field: 'number', size: '1fr', minSize: '6rem' },
              { field: 'sector', size: '1fr', minSize: '6rem' },
              { field: 'user', size: '1fr', minSize: '10rem' },
              { field: 'acquisition', size: '10rem', minSize: '6rem' },
              { field: 'devolution', size: '10rem', minSize: '6rem' },
            ]}
            rows={mapKeyRegister()}
          />
        }
        pagination={{
          pages: pagesCount,
          current: currentPage,
          onPageChange: setCurrentPage
        }}
      />

      <ConfirmKeyReturnModal
        isOpen={confirmKeyReturn}
        close={() => setConfirmKeyReturn(false)}
      />

      <ApproveScheduleModal
        isOpen={approveSchedules}
        close={() => setApprovedSchedules(false)}
        onApprove={listKeyRegister}
      />
    </>
  )
}
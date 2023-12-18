import { Header, MaterialSymbol, Modal } from "@/components";
import { CreateScheduleModal } from "@/components/CreateSchedule";
import { formatDate, parseTimestampWithoutTimeZone } from "@/helpers";
import { useAuth } from "@/hooks";
import { ScheduleModel } from "@/models";
import { scheduleService } from "@/services/schedule";
import { ApiError } from "@/types/ApiError";
import { Alert } from "@/utils";
import { Tempo } from "@/utils/Tempo";
import { endOfMonth, format, getDay, parse, startOfMonth, startOfWeek } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { toast } from "react-hot-toast";

type RangeChange = Date[] | {
  start: Date;
  end: Date;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'pt-BR': ptBR },
})

export const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState([] as ScheduleModel[]);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleModel>();
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleModel | null>(null);

  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Tempo()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Tempo()));

  const { ensureAuth, user } = useAuth();
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [isCurrentScheduleOpen, setIsCurrentScheduleOpen] = useState(false);

  const actions = useMemo(() => {
    const arr = [{ icon: <MaterialSymbol name="event_upcoming" />, onClick: ensureAuth(() => setIsCreateScheduleOpen(true)) }];
    currentSchedule ? arr.push({ icon: <MaterialSymbol name="key" />, onClick: ensureAuth(() => setIsCurrentScheduleOpen(true)) }) : null;

    return arr;
  }, [currentSchedule, user]);

  const onRangeChange = (event: RangeChange) => {
    if (Array.isArray(event)) {
      const startDate = new Date(event[0]);
      const endDate = new Date(event[event.length - 1]);
      endDate.setHours(23);
      endDate.setMinutes(23);
      endDate.setSeconds(59);

      setStartDate(startDate);
      setEndDate(endDate);
      return;
    }

    const startDate = event.start;
    const endDate = event.end;
    endDate.setHours(23);
    endDate.setMinutes(23);
    endDate.setSeconds(59);

    setStartDate(startDate);
    setEndDate(endDate);
  }

  const onSelectEvent = (event: { id: number }) => {
    const schedule = schedules.find((s) => s.id === event.id);

    if (!schedule) return;
    setSelectedSchedule(schedule);
  }

  const listSchedules = useCallback(async () => {
    if (!startDate || !endDate) return;

    try {
      const result = await scheduleService.list({ startDate, endDate });
      setSchedules(result);
    } catch (error) {
      toast.error('Não foi possível buscar os agendamentos!', { id: 'schedule-error-500' });
    }
  }, [startDate, endDate]);

  const getScheduleKey = async () => {
    if (!currentSchedule) return;

    try {
      await scheduleService.getKey(currentSchedule.id);
      toast.success("Chave pêga!");

      setCurrentSchedule(null);
      setIsCurrentScheduleOpen(false);
      listSchedules();
    } catch (error) {
      const message = (error as ApiError).response?.data.message;

      if (message === 'Schedule expired') {
        toast.error('Angendamento expirado!');

        setIsCurrentScheduleOpen(false);
        setCurrentSchedule(null);
        return;
      }

      if (message === 'Key is busy') {
        toast.error('Parece que alguêm ainda não devolveu a chave!');

        setIsCurrentScheduleOpen(false);
        return;
      }

      toast.error('Não foi possível pegar a chave!');
    }
  }

  const cancelSchedule = async (id: number) => {
    await Alert.fire({
      title: "Cancelar agendamento",
      description: "Deseja realmente cancelar o agendamento",
      confirm: { label: "Sim" },
      cancel: { label: 'Nâo' },
      onConfirm: async () => {
        try {
          await scheduleService.cancel(id);

          toast.success("Agendamento cancelado!");

          setSelectedSchedule(undefined);
          listSchedules();
        } catch (error) {
          toast.error("Não foi possível cancelar o agendamento")
        }
      }
    })
  }

  useEffect(() => {
    listSchedules();

    scheduleService.getCurrent().then(setCurrentSchedule);
  }, [listSchedules]);

  return (
    <>
      <CreateScheduleModal
        isOpen={isCreateScheduleOpen}
        close={() => setIsCreateScheduleOpen(false)}
        onCreate={() => {
          listSchedules();
          setIsCreateScheduleOpen(false);
        }}
      />

      <Header
        title="Agendamentos"
        search
        actions={actions}
      />

      <Calendar
        localizer={localizer}
        messages={{
          previous: '<',
          next: '>',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        }}
        startAccessor="start"
        endAccessor="endDate"
        views={['month', 'week', 'day']}
        events={schedules.map((s) => ({
          id: s.id,
          title: `Chave: ${s.key.number}, Setor: ${s.key.sector.name}`,
          start: parseTimestampWithoutTimeZone(s.acquisitionDate),
          endDate: parseTimestampWithoutTimeZone(s.devolutionDate),
        }))}
        culture="pt-BR"
        onRangeChange={onRangeChange}
        onSelectEvent={onSelectEvent}
      />

      <Modal
        title="Agendamento"
        isOpen={!!selectedSchedule}
        close={() => setSelectedSchedule(undefined)}
      >
        <div className="form">
          <label className="input__wrapper" htmlFor="user">
            Usuário
            <input id="user" type="text" className="form__input" value={selectedSchedule?.user.name} disabled />
          </label>

          <div className="form__row">
            <label className="input__wrapper" htmlFor="key_number">
              N° da chave
              <input id="key_number" type="text" className="form__input" value={selectedSchedule?.key.number} disabled />
            </label>

            <label className="input__wrapper" htmlFor="key_number">
              Setor
              <input id="key_number" type="text" className="form__input" value={selectedSchedule?.key.sector.name} disabled />
            </label>
          </div>

          <div className="form__row">
            <label className="input__wrapper" htmlFor="acquisition_date">
              Data de aquisição
              <input
                id="acquisition_date"
                type="text"
                className="form__input"
                value={selectedSchedule ? formatDate(parseTimestampWithoutTimeZone(selectedSchedule.acquisitionDate)) : '-'}
                disabled
              />
            </label>

            <label className="input__wrapper" htmlFor="key_number">
              Data de devolução
              <input
                id="key_number"
                type="text"
                className="form__input"
                value={selectedSchedule ? formatDate(parseTimestampWithoutTimeZone(selectedSchedule.devolutionDate)) : '-'}
                disabled
              />
            </label>

          </div>

          <label className="input__wrapper" htmlFor="key_caught">
            Chave pêga?
            <input id="key_caught" type="text" className="form__input" value={selectedSchedule?.caught ? 'Sim' : 'Não'} disabled />
          </label>

          {user && user.registry === selectedSchedule?.user.registry && !selectedSchedule.caught ? (
            <button className="form__button" onClick={() => cancelSchedule(selectedSchedule.id)}>Cancelar agendamento</button>
          ) : null}
        </div>
      </Modal>

      <Modal
        title="Agendamento"
        isOpen={isCurrentScheduleOpen}
        close={() => setIsCurrentScheduleOpen(false)}
      >
        <div className="form">
          <label className="input__wrapper" htmlFor="key_number">
            N° da chave
            <input id="key_number" type="text" className="form__input" value={currentSchedule?.key?.number} disabled />
          </label>

          <label className="input__wrapper" htmlFor="key_number">
            Setor
            <input id="key_number" type="text" className="form__input" value={currentSchedule?.key?.sector?.name} disabled />
          </label>

          <div className="form__row">
            <button className="form__button" onClick={getScheduleKey}>Pegar chave</button>
            <button className="form__button" onClick={() => cancelSchedule(currentSchedule?.id || 0)}>Cancelar agendamento</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
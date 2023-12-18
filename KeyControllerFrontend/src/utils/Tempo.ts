import {
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  format,
  utcToZonedTime,
} from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

const TIMEZONE = import.meta.env.VITE_TIMEZONE || 'America/Sao_Paulo';

type Time = Date | number | string;

class Tempo extends Date {
  static timezone = TIMEZONE;

  private static locale = ptBR;

  /**
   * Parse the UTC time to Timezone
   * @param date - UTC time
   */
  constructor(date?: Time) {
    if (date instanceof Tempo) {
      throw new Error('[Tempo] :: Tempo is for constructor');
    }

    const zonedDate = utcToZonedTime(date || new Date(), Tempo.timezone);
    super(zonedDate);
  }

  static now() {
    return new Tempo().getTime();
  }

  /**
   * Reset: hours, minutes, seconds and milliseconds
   */
  static resetTime(date: Time) {
    const updatedDate = new Tempo(date);

    updatedDate.setHours(0);
    updatedDate.setMinutes(0);
    updatedDate.setSeconds(0);
    updatedDate.setMilliseconds(0);

    return updatedDate;
  }

  /**
   * @param time - Format: HH:mm
   */
  static parseString(time: string) {
    if (!Tempo.isTimeString(time)) {
      throw new Error('[Tempo] :: Invalid time string format, correct: HH:mm');
    }

    const date = new Tempo();

    const [hours, minutes] = time.split(':').map(Number);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  /**
   * @param time - Format: HH:mm
   */
  static isTimeString(time: string) {
    return /[0-9]{2}:[0-9]{2}/.test(time);
  }

  /**
   * - Update current time hours and minutes
   * - Reset seconds and milliseconds
   */
  static updateDate(time: Date | string | number) {
    const date = new Date(time);

    const updatedDate = new Tempo();
    updatedDate.setHours(date.getHours());
    updatedDate.setMinutes(date.getMinutes());
    updatedDate.setSeconds(0);
    updatedDate.setMilliseconds(0);

    return updatedDate;
  }

  static getWeekday() {
    return format(new Tempo(), 'EEEE').toUpperCase();
  }

  static format(date: Date, formatStr: string) {
    return format(date, formatStr, {
      locale: this.locale,
    });
  }

  format(formatStr: string) {
    return format(this, formatStr, {
      locale: Tempo.locale,
    });
  }
}

export { Tempo };

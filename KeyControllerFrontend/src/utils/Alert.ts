import theme from '@/styles/theme';
import Swal from 'sweetalert2';

interface AlertProps {
  title: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirm?: { label: string; color?: string };
  onConfirm?: () => void;
  cancel?: { label: string; color?: string };
  deny?: { label: string; color?: string };
}

export class Alert {
  static fire(data: AlertProps) {
    const { title, description, type, confirm, cancel, deny, onConfirm } = data;

    return Swal.fire({
      title,
      text: description,
      icon: type,
      showCloseButton: true,

      showConfirmButton: !!confirm,
      confirmButtonText: confirm?.label || 'Confirmar',
      confirmButtonColor: confirm?.color || theme['black-1000'],
      showLoaderOnConfirm: !!onConfirm,

      showCancelButton: !!cancel,
      cancelButtonText: cancel?.label || 'Cancelar',
      cancelButtonColor: cancel?.color || theme['black-1000'],

      showDenyButton: !!deny,
      denyButtonText: deny?.label || 'Não',
      denyButtonColor: deny?.color || theme['danger-500'],

      preConfirm: onConfirm,

      allowOutsideClick: () => !Swal.isLoading(),
    });
  }
}

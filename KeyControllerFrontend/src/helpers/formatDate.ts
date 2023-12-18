const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export const formatDate = (date: Date | string | number) =>
  dateFormatter.format(new Date(date));

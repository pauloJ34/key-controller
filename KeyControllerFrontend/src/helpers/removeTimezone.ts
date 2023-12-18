export const removeTimezone = (date: Date) => date.toISOString().slice(0, 19);

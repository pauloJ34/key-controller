export function parseTimestampWithoutTimeZone(timestamp: string): Date {
  const timestampWithoutTimeZone = timestamp.replace(/[+-]\d{2}:\d{2}$/, '');
  return new Date(timestampWithoutTimeZone);
}

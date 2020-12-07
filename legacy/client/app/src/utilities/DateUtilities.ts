export function toVnDateFormat(date: string | Date) {
  return Intl.DateTimeFormat('vi').format(new Date(date));
}

const pad = (n) => n.toString().padStart(2, '0');

/**
 * Recibe un string en formato ISO (ej: "2025-11-20T03:15:00.000Z")
 * y devuelve "dd/mm/yyyy hh:mm"
 */
export const formatNotificationDate = (isoString) => {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
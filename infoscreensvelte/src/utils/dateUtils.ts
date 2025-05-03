export const formatTime = (date: Date): string =>
  date.toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

export const isDateInFuture = (date: Date): boolean => date > new Date();

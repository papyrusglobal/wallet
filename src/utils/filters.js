export const millisecondsToWords = (milliseconds, zero = '0s') => {
  if (milliseconds <= 0) {
    return zero;
  }
  const hours = Math.floor(milliseconds / 1000 / 3600);
  milliseconds = (milliseconds / 1000) % 3600;
  const minutes = Math.floor(milliseconds / 60);
  const seconds = Math.floor(milliseconds % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export const formatDate = (date: string): string => {
  const parsedDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
    parsedDate
  );
  const time = parsedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${formattedDate} ${time}`;
};

// Timezone and date conversion helpers
export const getUtcNow = () => new Date();

export const finlandTimezoneOffset = () => {
  const now = new Date();
  const winterTime = !isDaylightSavingTime(now);
  return winterTime ? 2 : 3;
};

export const isDaylightSavingTime = (date) => {
  const year = date.getUTCFullYear();
  const marchStart = new Date(Date.UTC(year, 2, 31));
  marchStart.setUTCDate(31 - marchStart.getUTCDay());
  marchStart.setUTCHours(1, 0, 0, 0);
  const octoberEnd = new Date(Date.UTC(year, 9, 31));
  octoberEnd.setUTCDate(31 - octoberEnd.getUTCDay());
  octoberEnd.setUTCHours(1, 0, 0, 0);
  return date >= marchStart && date < octoberEnd;
};

export const utcToFinland = (utcHours, utcMinutes) => {
  const offset = finlandTimezoneOffset();
  let finlandHours = utcHours + offset;
  if (finlandHours >= 24) finlandHours -= 24;
  return {hours: finlandHours, minutes: utcMinutes};
};

export const finnishToUtc = (finnishTimeString) => {
  const finnishTime = new Date(finnishTimeString);
  const offset = finlandTimezoneOffset();
  finnishTime.setHours(finnishTime.getHours() - offset);
  return finnishTime;
};

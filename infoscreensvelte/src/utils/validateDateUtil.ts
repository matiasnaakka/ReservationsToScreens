export const validateDateUtil = (dateStr: string): Date | null => {
	const date = new Date(dateStr);
	return !isNaN(date.getTime()) ? date : null;
};

export const isId = (value: string | undefined): boolean => {
	if (!value) return false;
	return !isNaN(parseInt(value));
};

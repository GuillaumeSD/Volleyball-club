export const isNotNull = <T>(value: T | null): value is T => value !== null;

export const includeNumbers = (value: string): boolean => /[0-9]/.test(value);

export const IsValidSet = (value: string): boolean => /^[0-9:]+$/.test(value);

export const isValidName = (value: string | undefined): boolean =>
  !!value && value.length > 1 && !includeNumbers(value);

export const addXHours = (date: Date, hours: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

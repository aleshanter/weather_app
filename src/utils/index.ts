export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  waitMs: number
): (...args: A) => void {
  let id: number | undefined;

  return (...args: A) => {
    clearTimeout(id);

    id = setTimeout(() => {
      fn(...args);
    }, waitMs);
  };
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
}

export function getFormattedDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(date));
}

import { invalidOperation } from './errors';

export interface Dictionary<T> {
  [key: string]: T | undefined;
}

export interface NumberDictionary<T> {
  [key: number]: T | undefined;
}

export function toDictionary<T>(array: T[], selector: (item: T) => string | number): Dictionary<T> {
  const dict: Dictionary<T> = {};

  for (const item of  array) {
    const key = selector(item);

    if (key in dict)
      throw invalidOperation();

    dict[key] = item;
  }

  return dict;
}

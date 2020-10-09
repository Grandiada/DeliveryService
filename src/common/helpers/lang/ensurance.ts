import { invalidOperation } from './errors';

export function defined<T>(value: T | undefined): T {

  if (value === undefined)
    throw invalidOperation();

  return value;
}

export function present<T>(value: T | null | undefined): T {

  if (value == null)
    throw invalidOperation();

  return value;
}

export function notEmpty<T>(value: T[] | null | undefined): T[];
export function notEmpty(value: string | null | undefined): string;
export function notEmpty(value: any): any {

  if (!value || (Array.isArray(value) && !value.length))
    throw invalidOperation();

  return value;
}

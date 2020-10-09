export function isDate(obj: any): boolean {
  // AngularJS
  return Object.prototype.toString.call(obj) === '[object Date]';
}

export function isObject(obj: any): boolean {
  // AngularJS
  return obj !== null && typeof obj === 'object';
}

export function likeArray(obj: any): boolean {

  if (Array.isArray(obj))
    return true;

  if (!obj)
    return false;

  if (typeof obj.length !== 'number')
    return false;

  return obj.length ? obj[0] !== undefined : true;
}

export function typeName(obj: any): string {
  return Array.isArray(obj) ? 'Array' : isDate(obj) ? 'Date' : typeof obj;
}

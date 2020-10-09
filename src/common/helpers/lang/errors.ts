import { typeName } from './type';

let isFirstTime = true;

function checkFirstTime(): void {
  if (isFirstTime) {
    // tslint:disable-next-line:no-debugger
    debugger;
    isFirstTime = false;
  }
}

export function notImplemented(): Error {
  checkFirstTime();
  return new Error('Not implemented');
}

export function notSupported(): Error {
  checkFirstTime();
  return new Error('Not supported');
}

export function outOfRange(argName: string): Error {
  checkFirstTime();

  if (argName == null) // is null or undefined
    throw invalidArgumentType('argName', argName);

  return new Error(`Out of range '${argName}'`);
}

export function invalidOperation(message?: string, innerError?: Error): Error {
  checkFirstTime();
  const error = new Error(message || 'Invalid operation');

  if (innerError)
    (error as any).innerError = innerError;

  return error;
}

export function invalidArgumentType(argName: string, argValue: any): Error {
  checkFirstTime();
  return new Error(`Argument '${argName || 'argName'}' is ${typeName(argValue)}`);
}

export function emptyArgument(
  argName: string, argValue: ArrayLike<any> | string | null | undefined): Error {

  checkFirstTime();

  if (argValue == null) // is null or undefined
    return invalidArgumentType(argName, argValue);

  return new Error(`Argument '${argName || 'argName'}' is empty`);
}

export function invalidArgument(argName: string, reason?: string): Error {
  checkFirstTime();
  let errorMessage = `Invalid argument '${argName || 'argName'}'.`;

  if (reason)
    errorMessage += ' Reason: ' + reason;

  return new Error(errorMessage);
}

export function errorToString(error: Error): string {
  return error.stack || ('' + error);
}

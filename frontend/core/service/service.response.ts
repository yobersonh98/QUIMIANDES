import { CustomError } from "../errors/errors";

export abstract class ServiceResponse<T> {
  constructor(public data?: T, public error?: CustomError) {}
}

export class SuccessResponse<T> extends ServiceResponse<T> {
  constructor(data: T) {
    super(data, undefined);
  }
}

export class ErrorResponse<T> extends ServiceResponse<T> {
  constructor(error: CustomError) {
    super(undefined, error);
  }
}
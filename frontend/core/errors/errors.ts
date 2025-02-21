export abstract class CustomError extends Error {
  constructor(public message: string, public code: number) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export  class UnknownError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}
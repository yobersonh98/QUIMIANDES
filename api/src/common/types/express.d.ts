// types/express.d.ts (puedes llamarlo como quieras)

import { JwtPayload } from ".";

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

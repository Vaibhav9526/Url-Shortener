import IAuthUser from "./Auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

export {};

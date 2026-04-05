declare module "express" {
  export interface Request {
    user?: {
      name: string | null;
      email: string;
      id: number;
      status: boolean;
    };
    token?: string;
  }
}

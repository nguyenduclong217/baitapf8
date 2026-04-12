declare module "express" {
  export interface Request {
    user?: {
      name: string | null;
      email: string;
      id: number;
      is_verified: boolean;
    };
    token?: string;
  }
}

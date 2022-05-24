declare namespace Express {
  interface User {
    id: number;
    password: string;
    roles: string;
    status: string;
    email: string;
    created_at: Date;
    recent_login_time: Date;
  }
  export interface Request {
    user?: User;
  }
}

export interface User {
  id: string;
  email: string;
  name: string;
  gender: string;
  roles: string[]; // מתאים למה שיש בשרת
}

export interface AuthState {
  user: User | null;
  error: string | null;
}

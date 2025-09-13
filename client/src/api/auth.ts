import { User } from '@/types';

interface RegisterRequest {
  email: string;
  password: string;
  gender: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export async function register(data: RegisterRequest): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Registration failed';
    try {
      const error = await response.json();
      errorMessage = error?.error || error?.message || errorMessage;
    } catch {
      // התגובה לא הייתה JSON או ריקה
    }
    throw new Error(errorMessage);
  }
}

export async function login(data: LoginRequest): Promise<User> {
  //test
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Login failed';
    try {
      const error = await response.json();
      errorMessage = error?.error || error?.message || errorMessage;
    } catch {
      // התגובה לא הייתה JSON — נשאיר את הודעת ברירת המחדל
    }

    throw new Error(errorMessage);
  }

  const loginResponse: LoginResponse = await response.json();

  localStorage.setItem('token', loginResponse.token);
  localStorage.setItem('user', JSON.stringify(loginResponse.user));

  return loginResponse.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

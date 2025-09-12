import { User } from '@/types';

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error('Failed to update user role');
  }
}

export async function getCurrentUser() {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  return await response.json(); // כולל roles
}

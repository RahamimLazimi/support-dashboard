function getUserRole(): 'User' | 'Agent' | 'Admin' | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const roles = payload['role']?.split(',') ?? [];
  if (roles.includes('Admin')) return 'Admin';
  if (roles.includes('Agent')) return 'Agent';
  if (roles.includes('User')) return 'User';
  return null;
}

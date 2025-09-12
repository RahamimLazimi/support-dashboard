import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import * as api from '@/api/users';
import { User } from '@/types';
import { useAppSelector } from '@/redux';
import { useTranslation } from 'react-i18next';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const currentUserId = currentUser?.id;
  const currentUserRole = currentUser?.roles[0] || 'User';

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api.getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    try {
      await api.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, roles: [newRole] } : u)));
      setSuccess(t('admin.roleUpdated'));
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    } finally {
      setLoadingUserId(null);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('admin.title')}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('admin.email')}</TableCell>
            <TableCell>{t('admin.name')}</TableCell>
            <TableCell>{t('admin.role')}</TableCell>
            <TableCell>{t('admin.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => {
            const userRole = u.roles[0] || 'User';
            const isCurrentUser = u.id === currentUserId;

            // לוגיקת הרשאות עריכה
            const canEditRole =
              currentUserRole === 'Admin'
                ? !isCurrentUser // Admin לא יכול לשנות לעצמו
                : currentUserRole === 'Agent' && userRole === 'User'; // Agent יכול לשנות רק משתמש רגיל

            // בניית רשימת אפשרויות ל־Select בהתאם לתפקיד
            let roleOptions: string[] = [];
            if (currentUserRole === 'Admin') {
              roleOptions = ['User', 'Agent', 'Admin'];
            } else if (currentUserRole === 'Agent' && userRole === 'User') {
              roleOptions = ['User', 'Admin'];
            }

            return (
              <TableRow key={u.id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>
                  {canEditRole ? (
                    <Select
                      value={userRole}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      size="small"
                      disabled={loadingUserId === u.id}
                    >
                      {roleOptions.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography>{userRole}</Typography>
                  )}
                </TableCell>
                <TableCell>{/* פעולות נוספות אפשר להוסיף כאן */}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* הודעת הצלחה */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* הודעת שגיאה */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

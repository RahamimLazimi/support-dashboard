import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { LoginPage, RegisterPage, DashboardPage, AdminUsersPage } from './pages';
import { ProtectedRoute } from './routes';
import TopBar from './components/TopBar';

function App() {
  return (
    <>
      <TopBar />
      <Box sx={{ mt: 10 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* דף הדאשבורד - כל משתמש מחובר */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* דף הניהול - רק מנהלים */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          {/* ✅ נתיב ברירת מחדל לכל נתיב לא קיים */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAppSelector } from '@/redux';

export default function WelcomeUser() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        שלום,
      </Typography>
      <Typography variant="h5" color="primary">
        {user?.name ?? 'משתמש'}
      </Typography>
    </Box>
  );
}

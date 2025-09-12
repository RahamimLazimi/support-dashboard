import React, { useEffect } from 'react';
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector, login } from '@/redux';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await dispatch(login(data));
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      {/* Toolbar with language toggle */}
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          {t('login.title')}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label={t('login.email')}
            fullWidth
            margin="normal"
            {...register('email', {
              required: t('login.errors.requiredEmail'),
              pattern: {
                value: /^\S+@\S+$/i,
                message: t('login.errors.invalidEmail'),
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label={t('login.password')}
            type="password"
            fullWidth
            margin="normal"
            {...register('password', {
              required: t('login.errors.requiredPassword'),
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              {t('login.button')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

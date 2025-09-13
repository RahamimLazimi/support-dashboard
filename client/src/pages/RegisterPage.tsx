import React from 'react';
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import * as api from '@/api';

interface RegisterFormInputs {
  email: string;
  name: string;
  gender: string;
  password: string;
  passwordConfirm: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [gender, setGender] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (data.password !== data.passwordConfirm) {
      setError(t('register.errors.passwordMismatch'));
      return;
    }
    setError(null);
    try {
      await api.register({
        email: data.email,
        password: data.password,
        name: data.name,
        gender,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          {t('register.title')}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label={t('register.email')}
            fullWidth
            margin="normal"
            {...register('email', {
              required: t('register.errors.requiredEmail'),
              pattern: {
                value: /^\S+@\S+$/i,
                message: t('register.errors.invalidEmail'),
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label={t('register.name')}
            fullWidth
            margin="normal"
            {...register('name', { required: t('register.errors.requiredName') })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            select
            size="small"
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            SelectProps={{ native: true }}
          >
            {[t('register.gender.male'), t('register.gender.female')].map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </TextField>

          <TextField
            label={t('register.password')}
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: t('register.errors.requiredPassword') })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            label={t('register.passwordConfirm')}
            type="password"
            fullWidth
            margin="normal"
            {...register('passwordConfirm', {
              required: t('register.errors.requiredPasswordConfirm'),
            })}
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm?.message}
          />

          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              {t('register.button')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

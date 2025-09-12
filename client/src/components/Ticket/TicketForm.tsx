import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAppDispatch, createTicket } from '@/redux';
import { TicketPriority } from '@/types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormValues {
  title: string;
  description: string;
  priority: TicketPriority;
}

export default function TicketForm() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'Low',
    },
  });

  const validationMessages = useMemo(
    () => ({
      titleRequired: t('tickets.newTicket.errors.requiredTitle'),
      descriptionRequired: t('tickets.newTicket.errors.requiredDescription'),
    }),
    [i18n.language],
  );

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await dispatch(createTicket(data)).unwrap(); // unwrap תזרוק שגיאה אם נכשלה
      reset();
      setSuccessOpen(true); // פותח את ה־Snackbar של הצלחה
    } catch (err: any) {
      setErrorMessage(err || 'Failed to create ticket');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('tickets.form')}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label={t('tickets.subject')}
          fullWidth
          margin="normal"
          {...register('title', { required: validationMessages.titleRequired })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          label={t('tickets.newTicket.fields.description')}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register('description', {
            required: t('tickets.newTicket.errors.requiredDescription'),
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <TextField
          select
          label={t('tickets.newTicket.fields.priority')}
          fullWidth
          margin="normal"
          defaultValue="Low"
          {...register('priority')}
        >
          <MenuItem value="Low">{t('tickets.priority.low')}</MenuItem>
          <MenuItem value="Medium">{t('tickets.priority.medium')}</MenuItem>
          <MenuItem value="High">{t('tickets.priority.high')}</MenuItem>
          <MenuItem value="Critical">{t('tickets.priority.critical')}</MenuItem>
        </TextField>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={20} /> : t('tickets.create')}
          </Button>
        </Box>
      </Box>
      <>
        {/* Existing Form UI */}

        <Snackbar
          open={successOpen}
          autoHideDuration={4000}
          onClose={() => setSuccessOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
            {t('tickets.success')}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={5000}
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </>
    </Paper>
  );
}

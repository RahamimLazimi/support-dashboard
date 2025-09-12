import { Box, Typography, Button, Divider } from '@mui/material';
import { useState } from 'react';
import { TicketForm, TicketList } from '@/components';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/redux'; // נניח שיש לך את זה ב־redux

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();

  const { user } = useAppSelector((state) => state.auth);
  const userRole = user?.roles?.[0]; // נניח שרק תפקיד אחד יש

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">{t('dashboard.title')}</Typography>

        {/* רק למשתמש רגיל */}
        {userRole === 'User' && (
          <Button variant="contained" onClick={() => setShowForm(!showForm)}>
            {showForm ? t('dashboard.hideForm') : t('dashboard.newTicket')}
          </Button>
        )}
      </Box>

      {showForm && <TicketForm />}
      <Divider sx={{ my: 4 }} />
      <TicketList />
    </Box>
  );
}

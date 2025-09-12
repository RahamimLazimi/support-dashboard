import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Toolbar,
  Snackbar,
  Alert,
} from '@mui/material';

import { AgentOption, CommentType, Ticket } from '@/types';
import { fetchTickets, fetchUsers, useAppDispatch, useAppSelector } from '@/redux';
import { addTicketComment, assignTicket, updateTicketStatus } from '@/api';
import { useEffect, useState } from 'react';
import { selectAgents, selectCurrentAgent, selectIsAdmin } from '@/redux/selectors/users';
import { t } from 'i18next';

interface Props {
  ticket: Ticket;
  agents: AgentOption[];
}

const priorityColors: Record<Ticket['priority'], 'default' | 'primary' | 'secondary' | 'error'> = {
  Low: 'default',
  Medium: 'primary',
  High: 'secondary',
  Critical: 'error',
};

const statusColors: Record<Ticket['status'], 'default' | 'warning' | 'success'> = {
  Open: 'warning',
  'In Progress': 'default',
  Resolved: 'success',
};

export default function TicketItem({ ticket, agents }: Props) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentAgent = useAppSelector(selectCurrentAgent);

  const roles = currentUser?.roles;
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAgent = roles?.includes('Agent');
  const allowToAddComment = isAdmin || roles?.includes('Agent');

  const [localComments, setLocalComments] = useState<CommentType[]>(ticket.comments ?? []);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const dispatch = useAppDispatch();

  const showMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusChange = async (newStatus: Ticket['status']) => {
    if (newStatus === 'Resolved') {
      const confirm = window.confirm('האם אתה בטוח שברצונך לסגור את הטיקט?');
      if (!confirm) return;
    }

    try {
      // קריאה לשרת
      if ((newStatus === 'In Progress' && !localComments && !comment) || !localComments[0]?.text) {
        showMessage(`חובה לשלוח בסטאטוס ${newStatus} תגובה כלשהי`, 'error');
        return;
      }

      await updateTicketStatus(ticket.id, newStatus, localComments[0].text);

      // עדכון לוקאלי של הסטטוס (בלי פנייה לשרת מחדש)
      dispatch({
        type: 'tickets/updateStatus',
        payload: { ticketId: ticket.id, newStatus },
      });
    } catch (err) {
      showMessage('נכשלה עדכון הסטטוס', 'error');
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);

      const newComment: CommentType = {
        text: comment.trim(),
        userEmail: currentUser?.email || 'Unknown',
        createdAt: new Date().toISOString(),
      };

      await addTicketComment(ticket.id, newComment);
      setLocalComments((prev) => [newComment, ...prev]);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* HEADER - כותרת ו־priority */}
        <Box
          sx={{
            minHeight: 56, // גובה קבוע לכותרת + צ'יפ
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {ticket.title}
          </Typography>
          <Chip label={ticket.priority} color={priorityColors[ticket.priority]} size="small" />
        </Box>

        {/* תיאור */}
        <Box sx={{ minHeight: 60 }}>
          <Typography variant="body2">{ticket.description}</Typography>
        </Box>

        {/* מידע נוסף (סטטוס, תאריך) */}
        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              label={ticket.status}
              color={statusColors[ticket.status]}
              variant="outlined"
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {t('tickets.createdAt')}: {new Date(ticket.createdAt).toLocaleString('en-GB')}
              <br />
              {t('tickets.createdBy')}: {ticket.createdByName}
            </Typography>
          </Stack>

          {/* אם אדמין – תפריט סטטוס */}
          {isAdmin && (
            <Box mt={1}>
              <Typography variant="subtitle2">שנה סטטוס</Typography>
              <Select
                value={ticket.status}
                size="small"
                onChange={(e) => handleStatusChange(e.target.value as Ticket['status'])}
              >
                {['Open', 'InProgress', 'Resolved'].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Box>

        {/* כפתור תגובות */}
        {allowToAddComment && (
          <Box mt={2}>
            <Button onClick={() => setOpenDialog(true)} variant="outlined" fullWidth>
              כרגע יש {localComments.length} תגובות, לחץ להוספה
            </Button>
          </Box>
        )}

        {/* הקצאה */}
        <Box mt={2}>{/* כאן הקוד הרגיל שלך להקצאה... */}</Box>

        {/* דיאלוג תגובות */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>תגובות על הטיקט</DialogTitle>
          <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
            <DialogContent dividers>
              {localComments.length === 0 ? (
                <Typography>אין תגובות עדיין.</Typography>
              ) : (
                localComments.map((c, idx) => (
                  <Box key={idx} sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                    <Typography fontWeight="bold">{c.userEmail}</Typography>
                    <Typography>{c.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(c.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              )}

              {allowToAddComment && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="כתוב תגובה"
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Box>
              )}
            </DialogContent>
          </Box>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>סגור</Button>
            {allowToAddComment && (
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={loading || !comment.trim()}
              >
                {loading ? <CircularProgress size={18} color="inherit" /> : 'שלח תגובה'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </CardContent>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

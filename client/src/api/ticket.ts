import { CommentType, Ticket, TicketStatus } from '@/types';

async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('token');
  const headers = new Headers(init?.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${input}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('authFetch error:', error);
    throw error; // חשוב לזרוק את השגיאה כדי שהקריאה תדע שהייתה בעיה
  }
}

export async function addTicketComment(ticketId: string, comment: CommentType): Promise<void> {
  const res = await authFetch(`tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });

  return res.json();
}

export async function getAllTickets(): Promise<Ticket[]> {
  const res = await authFetch('tickets');
  if (!res?.ok) throw new Error('Failed to fetch tickets');
  return res.json();
}

export async function createTicket(data: Partial<Ticket>): Promise<Ticket> {
  const res = await authFetch('tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus,
  comment?: string,
): Promise<void> {
  const statusToSend = status === 'In Progress' ? 'InProgress' : status;

  const res = await authFetch(`tickets/${ticketId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: statusToSend, comment }),
  });
  return res.json();
}

// הקצאה לסוכן ספציפי (ע"י Admin או Agent)
export async function assignTicket(ticketId: string, agentEmail: string): Promise<void> {
  const res = await authFetch(`tickets/${ticketId}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentEmail }),
  });

  if (!res.ok) throw new Error('Failed to assign ticket');
}

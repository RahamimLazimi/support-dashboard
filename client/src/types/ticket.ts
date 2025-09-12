export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
export type CommentType = {
  text: string;
  createdAt: string;
  userEmail: string;
};
export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt?: string;

  createdByName: string;
  createdByEmail: string;

  assignedAgentEmail?: string;

  comments?: CommentType[];
}
export interface AgentOption {
  email: string;
  name: string;
}

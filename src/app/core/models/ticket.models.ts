export type TicketStatus = 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO';

export type TicketPriority = 'BAIXA' | 'MEDIA' | 'ALTA';

export type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  owner_id: number;
  created_at: string;
  updated_at: string;
};

export type CreateTicketRequest = {
  title: string;
  description: string;
  priority?: TicketPriority;
};

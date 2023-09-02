export interface ITicket {
  id: string;
  title: string;
  description: string;
  createOn: string;
  resolved: boolean;
}

export interface ITicketReply {
  id: string;
  ticketId: string;
  message: string;
  createdOn: string;
}

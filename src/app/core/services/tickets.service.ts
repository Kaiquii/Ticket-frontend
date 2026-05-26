import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTicketRequest, Ticket, TicketStatus } from '../models/ticket.models';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  list(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
  }

  create(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, payload);
  }

  updateStatus(ticketId: number, status: TicketStatus): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${ticketId}/status`, { status });
  }

  delete(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tickets/${ticketId}`);
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Ticket, TicketPriority, TicketStatus } from '../../core/models/ticket.models';
import { AuthService } from '../../core/services/auth.service';
import { TicketsService } from '../../core/services/tickets.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

const STATUS_OPTIONS: TicketStatus[] = ['ABERTO', 'EM_ANDAMENTO', 'FINALIZADO'];
const PRIORITY_OPTIONS: TicketPriority[] = ['BAIXA', 'MEDIA', 'ALTA'];

@Component({
  selector: 'app-tickets-page',
  imports: [AppHeaderComponent, ConfirmModalComponent, DatePipe, ReactiveFormsModule],
  template: `
    <main class="min-h-dvh bg-[#f6f8fb] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <app-header (logout)="openLogoutModal()" />

      <section class="mx-auto w-full max-w-7xl px-5 py-6">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Total</p>
            <p class="mt-3 text-4xl font-black text-slate-950 dark:text-white">{{ tickets().length }}</p>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ totalLabel() }}</p>
          </article>

          <article class="rounded-lg border border-sky-100 bg-sky-50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/40">
            <p class="text-sm font-bold text-sky-700 dark:text-sky-300">Abertos</p>
            <p class="mt-3 text-4xl font-black text-sky-950 dark:text-sky-100">{{ openCount() }}</p>
            <p class="mt-2 text-sm text-sky-700 dark:text-sky-300">Aguardando triagem</p>
          </article>

          <article class="rounded-lg border border-amber-100 bg-amber-50 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/40">
            <p class="text-sm font-bold text-amber-700 dark:text-amber-300">Em andamento</p>
            <p class="mt-3 text-4xl font-black text-amber-950 dark:text-amber-100">{{ inProgressCount() }}</p>
            <p class="mt-2 text-sm text-amber-700 dark:text-amber-300">Com atendimento ativo</p>
          </article>

          <article class="rounded-lg border border-emerald-100 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40">
            <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300">Finalizados</p>
            <p class="mt-3 text-4xl font-black text-emerald-950 dark:text-emerald-100">{{ doneCount() }}</p>
            <p class="mt-2 text-sm text-emerald-700 dark:text-emerald-300">Resolvidos pelo time</p>
          </article>
        </div>

        <section class="mt-6 space-y-4">
          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Fila do usuario</p>
                <h2 class="mt-2 text-xl font-black text-slate-950 dark:text-white">Tickets cadastrados</h2>
              </div>

              <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 text-sm font-black text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400" type="button" (click)="openCreateModal()">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
                </svg>
                Novo chamado
              </button>
            </div>
          </div>

          @if (pageMessage()) {
            <p class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-200">{{ pageMessage() }}</p>
          }

          @if (loading()) {
            <div class="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Carregando tickets...
            </div>
          }

          @if (!loading() && tickets().length === 0) {
            <div class="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p class="text-lg font-black text-slate-950 dark:text-white">Nenhum ticket por aqui</p>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Abra o primeiro chamado pelo botao de novo ticket.</p>
            </div>
          }

          <div class="grid gap-4">
            @for (ticket of tickets(); track ticket.id) {
              <article class="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-800">
                <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div class="min-w-0 space-y-4">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">#{{ ticket.id }}</span>
                      <span [class]="priorityClass(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span>
                      <span [class]="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
                    </div>

                    <div>
                      <h3 class="wrap-break-word text-xl font-black leading-snug text-slate-950 dark:text-white">{{ ticket.title }}</h3>
                      <p class="mt-2 whitespace-pre-line wrap-break-word text-sm leading-6 text-slate-600 dark:text-slate-400">{{ ticket.description }}</p>
                    </div>

                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-500">
                      Criado em {{ ticket.created_at | date: 'dd/MM/yyyy HH:mm' }} - Atualizado em {{ ticket.updated_at | date: 'dd/MM/yyyy HH:mm' }}
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-2 xl:flex-col">
                    <button class="flex size-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-600 dark:hover:bg-slate-800" type="button" title="Editar status" aria-label="Editar status" (click)="openStatusModal(ticket)" [disabled]="updatingId() === ticket.id">
                      <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 20h4.4L19 9.4 14.6 5 4 15.6V20Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                        <path d="m13.5 6.1 4.4 4.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                    </button>

                    <button class="flex size-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-700 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-red-900/70 dark:bg-slate-950 dark:text-red-300 dark:hover:bg-red-950" type="button" title="Excluir ticket" aria-label="Excluir ticket" (click)="openDeleteModal(ticket)" [disabled]="updatingId() === ticket.id">
                      <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 7h14M10 11v6M14 11v6M9 7l.7-2h4.6L15 7M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        </section>
      </section>

      @if (showCreateModal()) {
        <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="new-ticket-title">
          <section class="flex max-h-[calc(100dvh-3rem)] w-full max-w-lg flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div class="shrink-0 p-6 pb-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-black uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">Novo chamado</p>
                  <h2 id="new-ticket-title" class="mt-2 text-2xl font-black text-slate-950 dark:text-white">Abrir ticket</h2>
                  <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Descreva o problema com clareza para acelerar o atendimento.</p>
                </div>

                <button class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" type="button" title="Fechar" aria-label="Fechar" (click)="closeCreateModal()">
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                  </svg>
                </button>
              </div>

              @if (formMessage()) {
                <p class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-200">{{ formMessage() }}</p>
              }
            </div>

            <form class="min-h-0 flex-1 overflow-y-auto px-6 pb-6" [formGroup]="ticketForm" (ngSubmit)="createTicket()" (scroll)="closePriorityDropdown()">
              <div class="space-y-5">
                <label class="block">
                  <span class="text-sm font-black text-slate-800 dark:text-slate-200">Titulo</span>
                  <input class="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-950" formControlName="title" maxlength="150" placeholder="Ex.: Erro ao acessar sistema" />
                </label>

                <label class="block">
                  <span class="text-sm font-black text-slate-800 dark:text-slate-200">Descricao</span>
                  <textarea class="mt-2 min-h-32 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-950" formControlName="description" placeholder="Conte o que aconteceu, quando comecou e o impacto."></textarea>
                </label>

                <label class="block">
                  <span class="text-sm font-black text-slate-800 dark:text-slate-200">Prioridade</span>
                  <button #priorityTrigger class="mt-2 flex h-11 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-left text-slate-950 outline-none hover:border-cyan-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-cyan-600 dark:focus:ring-cyan-950" type="button" aria-haspopup="listbox" [attr.aria-expanded]="showPriorityDropdown()" (click)="togglePriorityDropdown(priorityTrigger)">
                    <span class="flex items-center gap-2">
                      <span [class]="priorityDotClass(ticketForm.controls.priority.value)"></span>
                      <span>{{ priorityLabel(ticketForm.controls.priority.value) }}</span>
                    </span>
                    <svg class="size-4 text-slate-500 dark:text-slate-400" [class.rotate-180]="showPriorityDropdown()" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </label>

                <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button class="h-10 rounded-lg border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" type="button" (click)="closeCreateModal()">Cancelar</button>
                  <button class="h-10 rounded-lg bg-cyan-700 px-4 text-sm font-black text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400" type="submit" [disabled]="ticketForm.invalid || saving()">
                    {{ saving() ? 'Salvando...' : 'Criar ticket' }}
                  </button>
                </div>
              </div>
            </form>
          </section>

          @if (showPriorityDropdown()) {
            <div class="fixed z-50 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/40" role="listbox" aria-label="Prioridade" [style.left.px]="priorityDropdownLeft()" [style.top.px]="priorityDropdownTop()" [style.width.px]="priorityDropdownWidth()">
              @for (priority of priorities; track priority) {
                <button class="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-bold" type="button" role="option" [attr.aria-selected]="ticketForm.controls.priority.value === priority" [class]="priorityOptionClass(priority)" (click)="selectPriority(priority)">
                  <span class="flex items-center gap-2">
                    <span [class]="priorityDotClass(priority)"></span>
                    {{ priorityLabel(priority) }}
                  </span>

                  @if (ticketForm.controls.priority.value === priority) {
                    <svg class="size-4 text-cyan-700 dark:text-cyan-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  }
                </button>
              }
            </div>
          }
        </div>
      }

      @if (statusTicket()) {
        <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="status-ticket-title">
          <section class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">Editar ticket</p>
                <h2 id="status-ticket-title" class="mt-2 text-2xl font-black text-slate-950 dark:text-white">Alterar status</h2>
                <p class="mt-1 wrap-break-word text-sm leading-6 text-slate-600 dark:text-slate-400">{{ statusTicket()?.title }}</p>
              </div>

              <button class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" type="button" title="Fechar" aria-label="Fechar" (click)="closeStatusModal()">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <div class="mt-5 space-y-2" role="listbox" aria-label="Status">
              @for (status of statuses; track status) {
                <button class="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-950" type="button" role="option" [attr.aria-selected]="selectedStatus() === status" [class]="statusOptionClass(status)" (click)="selectedStatus.set(status)">
                  <span>
                    <span class="block text-sm font-black">{{ statusLabel(status) }}</span>
                    <span class="mt-1 block text-xs font-semibold opacity-75">{{ statusHelpText(status) }}</span>
                  </span>

                  @if (selectedStatus() === status) {
                    <span class="flex size-6 items-center justify-center rounded-full bg-cyan-700 text-white dark:bg-cyan-400 dark:text-slate-950">
                      <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  }
                </button>
              }
            </div>

            <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button class="h-10 rounded-lg border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" type="button" (click)="closeStatusModal()">Cancelar</button>
              <button class="h-10 rounded-lg bg-cyan-700 px-4 text-sm font-black text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400" type="button" (click)="confirmStatusChange()" [disabled]="updatingId() === statusTicket()?.id">
                {{ updatingId() === statusTicket()?.id ? 'Salvando...' : 'Salvar status' }}
              </button>
            </div>
          </section>
        </div>
      }

      @if (deleteTicketTarget()) {
        <app-confirm-modal
          title="Excluir ticket?"
          confirmLabel="Excluir"
          tone="danger"
          [loading]="updatingId() === deleteTicketTarget()?.id"
          (cancel)="closeDeleteModal()"
          (confirm)="confirmDelete()"
        >
          Tem certeza que deseja excluir o ticket <strong class="text-slate-950 dark:text-white">#{{ deleteTicketTarget()?.id }} - {{ deleteTicketTarget()?.title }}</strong>? Essa acao nao pode ser desfeita.
        </app-confirm-modal>
      }

      @if (showLogoutModal()) {
        <app-confirm-modal
          title="Sair do sistema?"
          confirmLabel="Sair"
          tone="danger"
          [loading]="false"
          (cancel)="closeLogoutModal()"
          (confirm)="confirmLogout()"
        >
          Tem certeza que deseja encerrar sua sessao agora?
        </app-confirm-modal>
      }
    </main>
  `,
})
export class TicketsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ticketsService = inject(TicketsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly statuses = STATUS_OPTIONS;
  readonly priorities = PRIORITY_OPTIONS;
  readonly tickets = signal<Ticket[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly updatingId = signal<number | null>(null);
  readonly pageMessage = signal('');
  readonly formMessage = signal('');
  readonly showCreateModal = signal(false);
  readonly showPriorityDropdown = signal(false);
  readonly priorityDropdownLeft = signal(0);
  readonly priorityDropdownTop = signal(0);
  readonly priorityDropdownWidth = signal(0);
  readonly showLogoutModal = signal(false);
  readonly statusTicket = signal<Ticket | null>(null);
  readonly selectedStatus = signal<TicketStatus>('ABERTO');
  readonly deleteTicketTarget = signal<Ticket | null>(null);
  readonly totalLabel = computed(() => {
    const total = this.tickets().length;
    return total === 1 ? '1 ticket encontrado' : `${total} tickets encontrados`;
  });
  readonly openCount = computed(() => this.countByStatus('ABERTO'));
  readonly inProgressCount = computed(() => this.countByStatus('EM_ANDAMENTO'));
  readonly doneCount = computed(() => this.countByStatus('FINALIZADO'));

  readonly ticketForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    priority: ['MEDIA' as TicketPriority, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    this.pageMessage.set('');

    this.ticketsService
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tickets) => this.tickets.set(tickets),
        error: () => this.pageMessage.set('Nao foi possivel carregar os tickets. Confirme se a API esta rodando.'),
      });
  }

  openCreateModal(): void {
    this.formMessage.set('');
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    if (this.saving()) {
      return;
    }

    this.showCreateModal.set(false);
    this.showPriorityDropdown.set(false);
    this.formMessage.set('');
    this.ticketForm.reset({ title: '', description: '', priority: 'MEDIA' });
  }

  togglePriorityDropdown(trigger: HTMLElement): void {
    if (this.showPriorityDropdown()) {
      this.showPriorityDropdown.set(false);
      return;
    }

    const rect = trigger.getBoundingClientRect();
    this.priorityDropdownLeft.set(rect.left);
    this.priorityDropdownTop.set(rect.bottom + 8);
    this.priorityDropdownWidth.set(rect.width);
    this.showPriorityDropdown.set(true);
  }

  closePriorityDropdown(): void {
    this.showPriorityDropdown.set(false);
  }

  selectPriority(priority: TicketPriority): void {
    this.ticketForm.controls.priority.setValue(priority);
    this.showPriorityDropdown.set(false);
  }

  createTicket(): void {
    if (this.ticketForm.invalid) {
      return;
    }

    this.saving.set(true);
    this.formMessage.set('');

    this.ticketsService
      .create(this.ticketForm.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (ticket) => {
          this.tickets.update((tickets) => [ticket, ...tickets]);
          this.showCreateModal.set(false);
          this.showPriorityDropdown.set(false);
          this.formMessage.set('');
          this.ticketForm.reset({ title: '', description: '', priority: 'MEDIA' });
        },
        error: () => this.formMessage.set('Nao foi possivel criar o ticket. Verifique os campos e tente novamente.'),
      });
  }

  openStatusModal(ticket: Ticket): void {
    this.pageMessage.set('');
    this.statusTicket.set(ticket);
    this.selectedStatus.set(ticket.status);
  }

  closeStatusModal(): void {
    if (this.updatingId()) {
      return;
    }

    this.statusTicket.set(null);
  }

  confirmStatusChange(): void {
    const ticket = this.statusTicket();

    if (!ticket) {
      return;
    }

    const status = this.selectedStatus();

    if (status === ticket.status) {
      this.closeStatusModal();
      return;
    }

    this.updatingId.set(ticket.id);
    this.pageMessage.set('');

    this.ticketsService
      .updateStatus(ticket.id, status)
      .pipe(finalize(() => this.updatingId.set(null)))
      .subscribe({
        next: (updatedTicket) => {
          this.tickets.update((tickets) => tickets.map((item) => (item.id === updatedTicket.id ? updatedTicket : item)));
          this.statusTicket.set(null);
        },
        error: () => {
          this.pageMessage.set('Nao foi possivel atualizar o status.');
          this.statusTicket.set(null);
          this.loadTickets();
        },
      });
  }

  openDeleteModal(ticket: Ticket): void {
    this.pageMessage.set('');
    this.deleteTicketTarget.set(ticket);
  }

  closeDeleteModal(): void {
    if (this.updatingId()) {
      return;
    }

    this.deleteTicketTarget.set(null);
  }

  confirmDelete(): void {
    const ticket = this.deleteTicketTarget();

    if (!ticket) {
      return;
    }

    this.updatingId.set(ticket.id);
    this.pageMessage.set('');

    this.ticketsService
      .delete(ticket.id)
      .pipe(finalize(() => this.updatingId.set(null)))
      .subscribe({
        next: () => {
          this.tickets.update((tickets) => tickets.filter((item) => item.id !== ticket.id));
          this.deleteTicketTarget.set(null);
        },
        error: () => {
          this.pageMessage.set('Nao foi possivel excluir o ticket.');
          this.deleteTicketTarget.set(null);
        },
      });
  }

  openLogoutModal(): void {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal(): void {
    this.showLogoutModal.set(false);
  }

  confirmLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  statusLabel(status: TicketStatus): string {
    const labels: Record<TicketStatus, string> = {
      ABERTO: 'Aberto',
      EM_ANDAMENTO: 'Em andamento',
      FINALIZADO: 'Finalizado',
    };

    return labels[status];
  }

  statusHelpText(status: TicketStatus): string {
    const labels: Record<TicketStatus, string> = {
      ABERTO: 'Ticket aguardando atendimento',
      EM_ANDAMENTO: 'Ticket em tratamento',
      FINALIZADO: 'Ticket resolvido',
    };

    return labels[status];
  }

  priorityLabel(priority: TicketPriority): string {
    const labels: Record<TicketPriority, string> = {
      BAIXA: 'Baixa',
      MEDIA: 'Media',
      ALTA: 'Alta',
    };

    return labels[priority];
  }

  statusClass(status: TicketStatus): string {
    const classes: Record<TicketStatus, string> = {
      ABERTO: 'rounded-md bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800 dark:bg-sky-950 dark:text-sky-200',
      EM_ANDAMENTO: 'rounded-md bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-200',
      FINALIZADO: 'rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    };

    return classes[status];
  }

  priorityClass(priority: TicketPriority): string {
    const classes: Record<TicketPriority, string> = {
      BAIXA: 'rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200',
      MEDIA: 'rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200',
      ALTA: 'rounded-md bg-red-100 px-2.5 py-1 text-xs font-black text-red-800 dark:bg-red-950 dark:text-red-200',
    };

    return classes[priority];
  }

  priorityDotClass(priority: TicketPriority): string {
    const classes: Record<TicketPriority, string> = {
      BAIXA: 'size-2.5 rounded-full bg-slate-400',
      MEDIA: 'size-2.5 rounded-full bg-indigo-500',
      ALTA: 'size-2.5 rounded-full bg-red-500',
    };

    return classes[priority];
  }

  priorityOptionClass(priority: TicketPriority): string {
    const selected = this.ticketForm.controls.priority.value === priority;
    const base = 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-200';
    const active = 'bg-cyan-50 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100';

    return selected ? active : base;
  }

  statusOptionClass(status: TicketStatus): string {
    const selected = this.selectedStatus() === status;
    const base = 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-slate-800';
    const active = 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-100 dark:border-cyan-400 dark:bg-cyan-950 dark:text-cyan-100 dark:ring-cyan-950';

    return selected ? active : base;
  }

  private countByStatus(status: TicketStatus): number {
    return this.tickets().filter((ticket) => ticket.status === status).length;
  }
}

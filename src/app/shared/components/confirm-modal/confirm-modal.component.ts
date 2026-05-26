import { Component, EventEmitter, Input, Output } from '@angular/core';

type ConfirmTone = 'danger' | 'default';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4 py-6" role="dialog" aria-modal="true" [attr.aria-labelledby]="titleId">
      <section class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex size-12 items-center justify-center rounded-lg" [class]="iconBoxClass">
          @if (tone === 'danger') {
            <svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 8v5M12 16.5v.1M10.2 4.7 3.4 17a2 2 0 0 0 1.8 3h13.6a2 2 0 0 0 1.8-3L13.8 4.7a2 2 0 0 0-3.6 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          } @else {
            <svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5v14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            </svg>
          }
        </div>

        <h2 [id]="titleId" class="mt-5 text-2xl font-black text-slate-950 dark:text-white">{{ title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          <ng-content />
        </p>

        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button class="h-10 rounded-lg border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" type="button" (click)="cancel.emit()" [disabled]="loading">
            Cancelar
          </button>
          <button class="h-10 rounded-lg px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300" [class]="confirmButtonClass" type="button" (click)="confirm.emit()" [disabled]="loading">
            {{ loading ? loadingLabel : confirmLabel }}
          </button>
        </div>
      </section>
    </div>
  `,
})
export class ConfirmModalComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) confirmLabel = 'Confirmar';
  @Input() loading = false;
  @Input() tone: ConfirmTone = 'default';
  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly confirm = new EventEmitter<void>();

  readonly titleId = `confirm-modal-${Math.random().toString(36).slice(2)}`;

  get loadingLabel(): string {
    return this.confirmLabel === 'Sair' ? 'Saindo...' : 'Processando...';
  }

  get iconBoxClass(): string {
    return this.tone === 'danger'
      ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200'
      : 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200';
  }

  get confirmButtonClass(): string {
    return this.tone === 'danger'
      ? 'bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500'
      : 'bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400';
  }
}

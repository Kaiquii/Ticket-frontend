import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white dark:bg-cyan-500 dark:text-slate-950">
            TD
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-black uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">Ticket Desk</p>
            <h1 class="truncate text-lg font-black text-slate-950 dark:text-white sm:text-xl">Painel de chamados</h1>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button class="flex size-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:bg-slate-800" type="button" [title]="themeService.isDark() ? 'Tema claro' : 'Tema escuro'" [attr.aria-label]="themeService.isDark() ? 'Tema claro' : 'Tema escuro'" (click)="themeService.toggleTheme()">
            @if (themeService.isDark()) {
              <svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4V2M12 22v-2M4.9 4.9 3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1l-1.4 1.4M20.5 3.5l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            } @else {
              <svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 15.3A8 8 0 0 1 8.7 4 8.5 8.5 0 1 0 20 15.3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            }
          </button>

          <button class="flex size-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-red-500 dark:hover:bg-red-950 dark:hover:text-red-200" type="button" title="Sair" aria-label="Sair" (click)="logout.emit()">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 7V5.8A1.8 1.8 0 0 1 11.8 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.2a1.8 1.8 0 0 1-1.8-1.8V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M4 12h10m0 0-3-3m3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  protected readonly themeService = inject(ThemeService);

  @Output() readonly logout = new EventEmitter<void>();
}

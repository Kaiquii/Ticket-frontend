import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="space-y-7">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">Novo acesso</p>
        <h2 class="mt-2 text-3xl font-black text-slate-950">Criar conta</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">Cadastre-se para abrir e acompanhar seus chamados.</p>
      </div>

      @if (message()) {
        <p class="rounded-md border px-4 py-3 text-sm font-semibold" [class.border-red-200]="hasError()" [class.bg-red-50]="hasError()" [class.text-red-700]="hasError()" [class.border-emerald-200]="!hasError()" [class.bg-emerald-50]="!hasError()" [class.text-emerald-700]="!hasError()">{{ message() }}</p>
      }

      <form class="space-y-5" [formGroup]="form" (ngSubmit)="submit()">
        <label class="block">
          <span class="text-sm font-bold text-slate-800">Nome</span>
          <input class="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" type="text" formControlName="name" autocomplete="name" placeholder="Seu nome" />
        </label>

        <label class="block">
          <span class="text-sm font-bold text-slate-800">E-mail</span>
          <input class="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" type="email" formControlName="email" autocomplete="email" placeholder="voce@email.com" />
        </label>

        <label class="block">
          <span class="text-sm font-bold text-slate-800">Senha</span>
          <input class="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" type="password" formControlName="password" autocomplete="new-password" placeholder="Minimo de 3 caracteres" />
        </label>

        <button class="flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300" type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Criando...' : 'Cadastrar' }}
        </button>
      </form>

      <p class="rounded-md bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
        Ja possui conta?
        <a routerLink="/auth/login" class="font-black text-cyan-700 hover:text-cyan-900">Entrar</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly message = signal('');
  readonly hasError = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.hasError.set(false);
        this.message.set('Conta criada com sucesso. Redirecionando para login...');
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 700);
      },
      error: () => {
        this.hasError.set(true);
        this.message.set('Nao foi possivel criar a conta. Verifique os dados ou tente outro e-mail.');
        this.loading.set(false);
      },
    });
  }
}

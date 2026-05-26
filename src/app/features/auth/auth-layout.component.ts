import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink, RouterOutlet],
  template: `
    <main class="min-h-dvh bg-[#f6f8fb] text-slate-950">
      <section class="mx-auto grid min-h-dvh w-full max-w-7xl items-stretch lg:grid-cols-[1fr_480px]">
        <div class="relative hidden overflow-hidden bg-slate-950 px-10 py-9 text-white lg:block">
          <div class="absolute inset-x-0 top-0 h-1 bg-cyan-400"></div>

          <div class="relative z-10 flex h-full flex-col justify-between">
            <div class="space-y-12">
              <a routerLink="/auth/login" class="inline-flex h-10 items-center rounded-md border border-white/15 px-4 text-sm font-bold text-white hover:bg-white/10">
                Ticket Desk
              </a>

              <div class="max-w-2xl space-y-5">
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Central de suporte</p>
                <h1 class="text-5xl font-black leading-tight text-white">
                  Um fluxo limpo para abrir, acompanhar e resolver chamados.
                </h1>
                <p class="max-w-xl text-base leading-7 text-slate-300">
                  Interface Angular com autenticacao JWT, status em tempo real na lista e organizacao pensada para evoluir por features.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-md border border-white/10 bg-white/5 p-4">
                <p class="text-3xl font-black text-white">01</p>
                <p class="mt-2 text-sm text-slate-300">Cadastro e login</p>
              </div>
              <div class="rounded-md border border-white/10 bg-white/5 p-4">
                <p class="text-3xl font-black text-white">02</p>
                <p class="mt-2 text-sm text-slate-300">Abertura de tickets</p>
              </div>
              <div class="rounded-md border border-white/10 bg-white/5 p-4">
                <p class="text-3xl font-black text-white">03</p>
                <p class="mt-2 text-sm text-slate-300">Gestao de status</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-8">
          <div class="w-full max-w-md">
            <div class="mb-8 lg:hidden">
              <a routerLink="/auth/login" class="inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-bold text-white">
                Ticket Desk
              </a>
              <h1 class="mt-6 text-3xl font-black leading-tight text-slate-950">Central de chamados</h1>
              <p class="mt-2 text-sm leading-6 text-slate-600">Acesse sua conta para gerenciar tickets.</p>
            </div>

            <section class="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <router-outlet />
            </section>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class AuthLayoutComponent {}

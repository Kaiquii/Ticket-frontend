import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getToken(): string | null {
    if (!this.hasLocalStorage()) {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    if (this.hasLocalStorage()) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearToken(): void {
    if (this.hasLocalStorage()) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  hasValidToken(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const expiration = this.getTokenExpiration(token);

    if (!expiration) {
      return false;
    }

    return expiration > Date.now();
  }

  private getTokenExpiration(token: string): number | null {
    if (typeof atob === 'undefined') {
      return null;
    }

    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    try {
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
      const decodedPayload = JSON.parse(atob(paddedPayload)) as { exp?: number };

      return decodedPayload.exp ? decodedPayload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}

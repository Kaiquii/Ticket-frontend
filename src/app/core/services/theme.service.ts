import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(false);

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    this.setTheme(!this.isDark());
  }

  private loadTheme(): void {
    if (typeof localStorage === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const storedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

    this.setTheme(storedTheme ? storedTheme === 'dark' : prefersDark);
  }

  private setTheme(isDark: boolean): void {
    this.isDark.set(isDark);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('isDark', isDark);
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    }
  }
}

export const environment = {
  get apiBaseUrl(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.__env?.API_BASE_URL ?? '';
  },
} as const;

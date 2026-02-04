import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'app-theme';

    // Initialize from localStorage or system preference
    private readonly initialTheme: Theme =
        (localStorage.getItem(this.THEME_KEY) as Theme) ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    readonly theme = signal<Theme>(this.initialTheme);

    constructor() {
        // Sync theme to DOM and localStorage whenever it changes
        effect(() => {
            const currentTheme = this.theme();
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem(this.THEME_KEY, currentTheme);
        });
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    isDark(): boolean {
        return this.theme() === 'dark';
    }
}

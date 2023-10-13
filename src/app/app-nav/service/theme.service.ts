import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private activeTheme: string = 'deeppurple-amber';

  getActiveTheme(): string {
    return this.activeTheme;
  }

  setActiveTheme(theme: string): void {
    this.activeTheme = theme;
    document.body.setAttribute('class', theme); // Apply the theme to the body or a root element
  }
}

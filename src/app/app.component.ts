import { Component, HostBinding } from '@angular/core';
import { ThemeService } from './app-nav/service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angularapp';
  constructor(private themeService: ThemeService) {}
  @HostBinding('class') className = this.themeService.getActiveTheme();

  toggleTheme(enable = true) {
    this.className = enable ? 'dark-mode' : 'light-mode';
  }
}

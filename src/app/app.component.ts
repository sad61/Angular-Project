import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angularapp';
  @HostBinding('class') className = 'light-mode';

  toggleTheme(enable = true) {
    if (enable) {
      this.className = 'dark-mode';
    } else {
      this.className = 'light-mode';
    }
  }
}

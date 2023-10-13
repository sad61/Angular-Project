import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  @Output() themeMode = new EventEmitter<boolean>();

  theme: boolean = false;

  themeToggle() {
    this.theme = !this.theme;
    this.themeMode.emit(this.theme);
  }

  @ViewChild('switchInput') switchInput!: ElementRef;

  // You can now access the input element in your component methods.
  // For example, you can add an event listener to it.

  ngAfterViewInit() {
    this.switchInput.nativeElement.addEventListener('change', () => {
      this.themeMode.emit(this.switchInput.nativeElement.checked);
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  isDarkTheme = false;
}

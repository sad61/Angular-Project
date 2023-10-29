import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public notification$: Subject<string> = new Subject();
  time: number = 3000;
  constructor(private snackBar: MatSnackBar) {}

  notify(message: string) {
    this.snackBar.open(message, 'dismiss', { duration: this.time });
  }
}

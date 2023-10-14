import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  employeeName: string = 'Roberto';
  @Input() employeeDale!: string;
}

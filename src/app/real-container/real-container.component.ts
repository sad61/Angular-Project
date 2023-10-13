import { Component, ContentChild } from '@angular/core';
import { EmployeesComponent } from '../employees/employees.component';

@Component({
  selector: 'app-real-container',
  templateUrl: './real-container.component.html',
  styleUrls: ['./real-container.component.css'],
})
export class RealContainerComponent {
  @ContentChild(EmployeesComponent) employee!: EmployeesComponent;

  ngAfterContentInit() {
    if (this.employee !== undefined) this.employee.employeeName = 'Godofredo';
  }
}

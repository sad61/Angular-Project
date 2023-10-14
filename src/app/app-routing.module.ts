import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { ContainersComponent } from './containers/containers.component';
import { LinkedListComponent } from './linked-list-container/linked-list/linked-list.component';
import { LinkedListContainerComponent } from './linked-list-container/linked-list-container.component';

const routes: Routes = [
  { path: 'employee', component: EmployeesComponent },
  { path: 'containers', component: ContainersComponent },
  { path: 'linked-list-container', component: LinkedListContainerComponent },
  { path: '', redirectTo: '/containers', pathMatch: 'full' },
  { path: '**', redirectTo: '/containers', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

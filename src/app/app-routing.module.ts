import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { ContainersComponent } from './containers/containers.component';
import { RealContainerComponent } from './real-container/real-container.component';
import { LinkedListComponent } from './real-container/linked-list-container/linked-list/linked-list.component';
import { LinkedListContainerComponent } from './real-container/linked-list-container/linked-list-container.component';

const routes: Routes = [
  { path: 'employee', component: EmployeesComponent },
  { path: 'containers', component: ContainersComponent },
  {
    path: 'real-container',
    children: [
      {
        path: 'linked-list-container',
        component: LinkedListContainerComponent,
      },
    ],
  },
  { path: '', redirectTo: '/containers', pathMatch: 'full' },
  { path: '**', redirectTo: '/containers', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

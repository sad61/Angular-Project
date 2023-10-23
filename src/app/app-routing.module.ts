import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkedListContainerComponent } from './linked-list-container/linked-list-container.component';
import { BinaryTreeContainerComponent } from './binary-tree-container/binary-tree-container.component';

const routes: Routes = [
  { path: 'linked-list-container', component: LinkedListContainerComponent },
  { path: 'binary-tree-container', component: BinaryTreeContainerComponent },
  { path: '', redirectTo: '/linked-list-container', pathMatch: 'full' },
  { path: '**', redirectTo: '/linked-list-container', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

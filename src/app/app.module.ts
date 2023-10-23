import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { APP_CONFIG, APP_SERVICE_CONFIG } from './AppConfig/appconfig.service';
import { RequestInterceptor } from './request.interceptor';
import { AppNavComponent } from './app-nav/app-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { NodeComponent } from './linked-list-container/node/node.component';
import { LinkedListComponent } from './linked-list-container/linked-list/linked-list.component';
import { LinkedListContainerComponent } from './linked-list-container/linked-list-container.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NodemenuComponent } from './linked-list-container/nodemenu/nodemenu.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BinaryTreeContainerComponent } from './binary-tree-container/binary-tree-container.component';
import { BinaryTreeComponent } from './binary-tree-container/binary-tree/binary-tree.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeNodeComponent } from './binary-tree-container/tree-node/tree-node.component';
import { BinaryTreeMenuComponent } from './binary-tree-container/binary-tree-menu/binary-tree-menu.component';
import { DragScrollDirective } from './binary-tree-container/drag-scroll.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    NodeComponent,
    LinkedListComponent,
    LinkedListContainerComponent,
    NodemenuComponent,
    BinaryTreeContainerComponent,
    BinaryTreeComponent,
    TreeNodeComponent,
    BinaryTreeMenuComponent,
    DragScrollDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSlideToggleModule,
    DragDropModule,
    MatSelectModule,
    MatMenuModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: APP_SERVICE_CONFIG, useValue: APP_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

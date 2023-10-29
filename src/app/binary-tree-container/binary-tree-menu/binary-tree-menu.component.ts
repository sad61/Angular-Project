import { Component, HostListener, Input } from '@angular/core';
import { Node } from '../tree-node/tree-node.component';
import { BinaryTreeService } from '../service/binary-tree.service';
import { Subscription } from 'rxjs';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-binary-tree-menu',
  templateUrl: './binary-tree-menu.component.html',
  styleUrls: ['./binary-tree-menu.component.scss'],
})
export class BinaryTreeMenuComponent {
  @Input() node!: Node | null;
  childData: any;

  rightData!: any;
  leftData!: any;

  private nodeSubscription!: Subscription;

  constructor(
    private treeService: BinaryTreeService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.nodeSubscription = this.treeService.getNode$().subscribe((node) => {
      this.node = node!;
      this.rightData = node?.right?.data;
      this.leftData = node?.left?.data;
    });
  }

  ngOnDestroy() {
    this.treeService.selectedNode = null;
    this.node = null;
    this.nodeSubscription.unsubscribe();
  }

  addChild() {
    if (this.childData !== '') {
      this.treeService.insert(this.childData);
      this.childData = '';
    }
  }

  clear() {
    this.node = null;
  }

  root() {
    if (this.treeService.getRoot())
      this.treeService.getNode$().next(this.treeService.getRoot()!);
  }

  insertRight() {
    const data = parseInt(this.rightData);
    if (!this.treeService.isValidInput(data)) return;
    this.node = this.treeService.insertRight(this.node, data);
    this.treeService.nodesNumber.push(data);
    this.treeService.updateDepths(this.treeService.root);
    this.notificationService.notify('Node inserido!');
  }

  insertLeft() {
    if (this.leftData === '') return;
    const data = parseInt(this.leftData);
    if (!this.treeService.isValidInput(data)) return;
    this.node = this.treeService.insertLeft(this.node, data);
    this.treeService.nodesNumber.push(data);
    this.treeService.updateDepths(this.treeService.root);
    this.notificationService.notify('Node inserido!');
  }
}

import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Node } from '../tree-node/tree-node.component';
import { BinaryTreeService } from '../service/binary-tree.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BinaryTreeMenuComponent } from '../binary-tree-menu/binary-tree-menu.component';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-binary-tree',
  templateUrl: './binary-tree.component.html',
  styleUrls: ['./binary-tree.component.scss'],
})
export class BinaryTreeComponent {
  nodeData: any;

  root: Node | null = null;

  searchData: any;

  selectedNode!: Node | null;

  delayData: number;

  isResolving: boolean = false;

  searchMode: string = 'in-order';

  private rootSubscription: Subscription;

  private nodeSubscription: Subscription;

  @ViewChild(BinaryTreeMenuComponent) binaryMenu!: BinaryTreeMenuComponent;

  constructor(
    private treeService: BinaryTreeService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.nodeData = '';
    this.delayData = this.treeService.delay;

    this.rootSubscription = this.treeService
      .getRoot$()
      .subscribe((root: Node | null) => {
        this.root = root;
      });

    this.nodeSubscription = this.treeService
      .getNode$()
      .subscribe((node: Node | null) => {
        this.selectedNode = node;
      });
  }

  ngOnDestroy() {
    this.rootSubscription.unsubscribe();
    this.clear();
  }

  updateDelay() {
    this.treeService.delay = this.delayData;
  }

  addNode() {
    if (this.nodeData === '') return;
    if (!this.isResolving) {
      this.isResolving = true;
      const data = parseInt(this.nodeData);

      if (!this.treeService.isValidInput(data)) {
        this.isResolving = false;
        return;
      }

      this.treeService.insert(data);
      this.nodeData = '';
      this.notificationService.notify(`Valor ${data} insderido!`);
      this.isResolving = false;
      return;
    }
    this.notificationService.notify(`Um valor já ta sendo inserido!`);
  }

  checkIfBalanced() {
    if (this.root === null) {
      this.notificationService.notify('Árvore não possui nenhum valor!');
      return;
    }
    if (this.treeService.isBalanced(this.root)) {
      this.notificationService.notify('A Árvore está balanceada.');
      return;
    }
    this.notificationService.notify('A Árvore não está balanceada!');
  }

  async balance() {
    if (this.root === null) {
      this.notificationService.notify('Árvore não possui nenhum valor!');
      return;
    }
    if (!this.treeService.isBalanced(this.root)) {
      this.root = await this.treeService.balanceTree(this.root);
      this.notificationService.notify('A Árvore foi balanceada!');
      return;
    }
    this.notificationService.notify('A Árvore já está balanceada!');
  }

  async searchNode() {
    if (this.searchData === '') return;
    if (this.root === null) return;
    const data = parseInt(this.searchData);
    let flag: boolean = false;
    if (!this.treeService.isNumber(data)) return;
    if (!this.isResolving) {
      this.isResolving = true;
      switch (this.searchMode) {
        case 'pre-order':
          flag = await this.treeService.preOrderTraversal(this.root, data);
          break;

        case 'in-order':
          flag = await this.treeService.inOrderTraversal(this.root, data);
          break;

        case 'post-order':
          flag = await this.treeService.posOrderTraversal(this.root, data);
          break;
      }
      this.isResolving = false;
    }
    if (!flag) {
      this.notificationService.notify('Node não encontrado');
      return;
    }
    this.notificationService.notify('Node encontrado');
  }

  rotateLeft() {
    // this.treeService.setNode$(this.treeService.leftRotate(this.selectedNode!));
    // console.log(this.root);
  }

  rotateRight() {
    // this.treeService.setNode$(this.treeService.rightRotate(this.selectedNode!));
    // console.log(this.root);
  }

  clear() {
    this.selectedNode = null;
    this.root = null;
    this.treeService.inOrderTraversal(this.root, 0);
    this.binaryMenu.clear();
    this.treeService.clear();
  }

  preOrder() {
    this.searchMode = 'pre-order';
  }

  inOrder() {
    this.searchMode = 'in-order';
  }

  postOrder() {
    this.searchMode = 'post-order';
  }
}

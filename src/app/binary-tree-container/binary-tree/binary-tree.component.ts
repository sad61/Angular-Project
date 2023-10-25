import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Node } from '../tree-node/tree-node.component';
import { BinaryTreeService } from '../service/binary-tree.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  delayData: number = 400;

  isResolving: boolean = false;

  private rootSubscription: Subscription;

  constructor(
    private treeService: BinaryTreeService,
    private snackBar: MatSnackBar
  ) {
    this.nodeData = '';

    this.rootSubscription = this.treeService
      .getRoot$()
      .subscribe((root: Node | null) => {
        this.root = root;
      });
  }

  ngOnDestroy() {
    this.rootSubscription.unsubscribe();
    this.clear();
  }

  updateDelay() {
    this.treeService.delay = this.delayData;
  }

  async addNode() {
    const data = parseInt(this.nodeData);
    if (!this.treeService.isNumber(data)) {
      this.snackBar.open(`Passe um valor válido (número)!`, 'Dismiss');
      return;
    }
    if (!this.treeService.isInsertable(data)) {
      this.snackBar.open(`Árvore já possui esse valor!`, 'Dismiss');
      return;
    }

    await this.treeService.insert(data);
    this.nodeData = '';
    this.snackBar.open(`Valor ${data} insderido!`, 'Dismiss');
  }

  checkIfBalanced() {
    if (this.root === null) {
      this.snackBar.open('Árvore não possui nenhum valor!', 'Dismiss');
      return;
    }
    if (this.treeService.isAVL(this.root)) {
      this.snackBar.open('A Árvore está balanceada.', 'Dismiss');
      return;
    }

    this.snackBar.open('A Árvore não está balanceada!', 'Dismiss');
    // if (this.root === null) return;
    // const balanced = this.treeService.isBalanced(this.root);
    // if (!balanced) {
    //   this.snackBar.open(`Árvore não está balanceada.`, 'Dismiss');
    //   return;
    // }
    // this.snackBar.open(`Árvore balanceada.`, 'Dismiss');
  }

  async searchNode() {}

  clear() {
    this.selectedNode = null;
    this.root = null;
    this.treeService.clear();
  }
}

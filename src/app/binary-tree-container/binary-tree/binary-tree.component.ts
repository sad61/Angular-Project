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
  rootData: any;

  tree!: Node[] | null;

  root!: Node | null;

  searchData: any;

  selectedNode!: Node | null;

  delay: number = 400;

  isResolving: boolean = false;

  private treeSubscription: Subscription;

  constructor(
    private treeService: BinaryTreeService,
    private snackBar: MatSnackBar
  ) {
    this.rootData = '';
    this.treeSubscription = this.treeService.getTree$().subscribe((tree) => {
      this.tree = tree;
    });
  }

  ngOnDestroy() {
    this.treeSubscription.unsubscribe();
    this.clear();
  }

  addRoot() {
    if (this.rootData) {
      console.log(this.treeService.getRoot()!);
      this.treeService.addRoot(this.rootData);
      this.root = this.treeService.getRoot();
      this.rootData = '';
      this.treeService.setNode$(this.root!);
    }
  }

  async searchNode() {
    if (this.isResolving) {
      this.snackBar.open(`Aguarde a procura terminar.`, 'Dismiss');
      return;
    }
    const root = this.treeService.getRoot();
    if (!root) return null;
    this.isResolving = true;

    let data = this.searchData;
    let path: string[] = [];

    const stack = [root];

    while (stack.length > 0) {
      let currentNode = stack.pop();

      await new Promise((resolve) => setTimeout(resolve, this.delay));
      this.treeService.setNode$(currentNode!);
      if (currentNode?.getData() === this.searchData) {
        while (currentNode?.getAncestor()) {
          path.push(currentNode.getData().toString());
          currentNode = currentNode?.getAncestor();
        }
        this.snackBar.open(
          `Node '${data}' encontrado '${root.getData().toString()}->${path
            .reverse()
            .join('->')}`,
          'Dismiss'
        );
        break;
      }

      for (let i = currentNode?.getChildren().length! - 1; i >= 0; i--) {
        stack.push(currentNode?.getChildren()[i]!);
      }
    }
    this.isResolving = false;
    return null;
  }

  clear() {
    this.tree = null;
    this.selectedNode = null;
    this.root = null;
    this.treeService.clear();
  }
}

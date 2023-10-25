import { Injectable } from '@angular/core';
import { Node } from '../tree-node/tree-node.component';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BinaryTreeService {
  root$: ReplaySubject<Node | null>;
  node$: ReplaySubject<Node | null>;
  root: Node | null = null;
  nodesNumber: number[];

  treeDepth = 0;
  selectedNode: Node | null = null;
  delay: number = 400;

  constructor() {
    this.nodesNumber = [];
    this.node$ = new ReplaySubject<Node | null>(1);
    this.root$ = new ReplaySubject<Node | null>(1);
  }

  ngOnDestroy() {
    console.log('destrui serviço');
    this.clear();
  }

  clear() {
    this.root$?.next(null);
    this.treeDepth = 0;
    this.setNode$(null!);
  }

  getRoot$(): ReplaySubject<Node | null> {
    return this.root$;
  }

  setRoot$(node: Node | null) {
    this.root$.next(node);
  }

  getNode$(): ReplaySubject<Node | null> {
    return this.node$;
  }

  setNode$(node: Node) {
    this.selectedNode = node;
    this.node$.next(node);
  }

  getRoot(): Node | null {
    return this.root;
  }

  isNumber(data: any): boolean {
    return typeof data === 'number';
  }

  isInsertable(data: any): boolean {
    return !this.nodesNumber.includes(data);
  }

  getHeight(node: Node | null): number {
    if (node === null) {
      return 0;
    }
    return node.depth;
  }

  updateDepth(node: Node) {
    const leftDepth = this.getHeight(node.left);
    const rightDepth = this.getHeight(node.right);
    node.depth = Math.max(leftDepth, rightDepth) + 1;
  }

  rotateRight(y: Node): Node {
    const x = y.left as Node;
    const T2 = x.right as Node;

    x.right = y;
    y.left = T2;

    this.updateDepth(y);
    this.updateDepth(x);

    return x;
  }

  rotateLeft(x: Node): Node {
    const y = x.right as Node;
    const T2 = y.left as Node;

    y.left = x;
    x.right = T2;

    this.updateDepth(x);
    this.updateDepth(y);

    return y;
  }

  getBalanceFactor(node: Node | null): number {
    if (node === null) {
      return 0;
    }
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  async insert(data: number) {
    this.root = await this._insert(this.root, data);
    this.root$.next(this.root);
    this.nodesNumber.push(data);
  }

  private async _insert(node: Node | null, data: number): Promise<Node> {
    if (node === null) {
      return new Node(data);
    }

    await new Promise((resolve) => setTimeout(resolve, this.delay));
    this.setNode$(node);

    if (data < node.data) {
      node.left = await this._insert(node.left, data);
    } else if (data > node.data) {
      node.right = await this._insert(node.right, data);
    } else {
      return node;
    }

    this.updateDepth(node);

    const balance = this.getBalanceFactor(node);

    if (balance > 1 && data < (node.left as Node).data) {
      return this.rotateRight(node);
    }
    if (balance < -1 && data > (node.right as Node).data) {
      return this.rotateLeft(node);
    }
    if (balance > 1 && data > (node.left as Node).data) {
      node.left = this.rotateLeft(node.left as Node);
      return this.rotateRight(node);
    }
    if (balance < -1 && data < (node.right as Node).data) {
      node.right = this.rotateRight(node.right as Node);
      return this.rotateLeft(node);
    }
    return node;
  }

  inOrderTraversal(node: Node | null) {
    if (node === null) return;
    this.inOrderTraversal(node!.left);
    console.log(node);
    this.inOrderTraversal(node!.right);
  }

  isAVL(root: Node | null): boolean {
    function getHeight(node: Node | null): number {
      if (node === null) {
        return 0;
      }
      const leftHeight = getHeight(node.left);
      const rightHeight = getHeight(node.right);
      return Math.max(leftHeight, rightHeight) + 1;
    }

    function isBalanced(node: Node | null): boolean {
      if (node === null) {
        return true;
      }

      const leftHeight = getHeight(node.left);
      const rightHeight = getHeight(node.right);

      if (Math.abs(leftHeight - rightHeight) > 1) {
        return false;
      }
      return isBalanced(node.left) && isBalanced(node.right);
    }

    return isBalanced(root);
  }
}

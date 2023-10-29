import { Injectable } from '@angular/core';
import { Node } from '../tree-node/tree-node.component';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

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
  delay: number = 100;

  constructor(
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
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
    this.node$.next(null);
    this.root = null;
    this.treeDepth = 0;
    this.nodesNumber = [];
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

  setNode$(node: Node | null) {
    this.selectedNode = node;
    this.node$.next(node);
  }

  getRoot(): Node | null {
    return this.root;
  }

  isNumber(data: any): boolean {
    const parseddata = parseInt(data);
    return !isNaN(parseddata) && typeof parseddata === 'number';
  }

  isInsertable(data: any): boolean {
    return !this.nodesNumber.includes(data);
  }

  isValidInput(data: any): boolean {
    if (!this.isNumber(data)) {
      this.notificationService.notify('Passe um valor válido');
      return false;
    }
    if (!this.isInsertable(data)) {
      this.notificationService.notify('Árvore já possui esse valor!');
      return false;
    }
    return true;
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

    if (balance > 1 && data < node.left!.data) {
      return this.rotateRight(node);
    }
    if (balance < -1 && data > node.right!.data) {
      return this.rotateLeft(node);
    }
    if (balance > 1 && data > node.left!.data) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }
    if (balance < -1 && data < node.right!.data) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }
    return node;
  }

  insertRight(node: Node | null, data: number): Node {
    if (node === null) {
      return new Node(data);
    }

    if (data > node.data) {
      node.right = this.insertRight(node.right, data);
    }

    node.depth = 1 + Math.max(node.left?.depth || 0, node.right?.depth || 0);

    return node;
  }

  insertLeft(node: Node | null, data: number): Node {
    if (node === null) {
      return new Node(data);
    }

    node.left = this.insertLeft(node.left, data);

    // Update the depth of the current node and its ancestors
    this.updateDepth(node);

    return node;
  }

  getBalanceFactor(node: Node | null): number {
    if (node === null) {
      return 0;
    }
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  isBalanced(root: Node | null): boolean {
    if (root === null) {
      return true;
    }

    const leftHeight = this.getHeight(root.left);
    const rightHeight = this.getHeight(root.right);
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    }

    return this.isBalanced(root.left) && this.isBalanced(root.right);
  }

  getHeight(node: Node | null): number {
    return node ? node.depth : 0;
  }

  updateDepth(node: Node) {
    node.depth =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  rotateRight(node: Node): Node {
    const newRoot = node.left!;
    node.left = newRoot.right;
    newRoot.right = node;
    this.updateDepth(node);
    this.updateDepth(newRoot);
    return newRoot;
  }

  rotateLeft(node: Node): Node {
    const newRoot = node.right!;
    node.right = newRoot.left;
    newRoot.left = node;
    this.updateDepth(node);
    this.updateDepth(newRoot);
    return newRoot;
  }

  balanceTree(node: Node | null): Node | null {
    if (node === null) {
      return null;
    }

    const balanceFactor = this.getBalanceFactor(node);

    if (balanceFactor > 1) {
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left!);
      }
      return this.rotateRight(node);
    }

    // Right-Heavy
    if (balanceFactor < -1) {
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right!);
      }
      return this.rotateLeft(node);
    }

    return node;
  }

  updateDepths(node: Node | null): Node | null {
    if (node === null) {
      return null;
    }

    node.left = this.updateDepths(node.left);
    node.right = this.updateDepths(node.right);

    node.depth =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    return node;
  }

  async preOrderTraversal(node: Node | null, data: number): Promise<boolean> {
    if (node === null) return false;

    this.setNode$(node);
    if (data === node.data) return true;
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    if (await this.preOrderTraversal(node.left, data)) return true;

    if (await this.preOrderTraversal(node.right, data)) return true;

    return false;
  }

  async inOrderTraversal(node: Node | null, data: number): Promise<boolean> {
    if (node === null) return false;

    if (await this.inOrderTraversal(node.left, data)) return true;

    this.setNode$(node);
    console.log(node);
    if (data === node.data) return true;
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    if (await this.inOrderTraversal(node.right, data)) return true;
    return false;
  }

  async posOrderTraversal(node: Node | null, data: number): Promise<boolean> {
    if (node === null) return false;

    if (await this.posOrderTraversal(node.left, data)) return true;

    if (await this.posOrderTraversal(node.right, data)) return true;

    this.setNode$(node);
    if (data === node.data) return true;
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    return false;
  }
}

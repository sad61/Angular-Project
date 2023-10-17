import { Injectable } from '@angular/core';
import { Node } from '../tree-node/tree-node.component';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BinaryTreeService {
  root: Node | null = null;

  node$!: ReplaySubject<Node | null>;

  tree$: BehaviorSubject<Node[] | null>;

  changes: Node[] = [];

  constructor() {
    this.tree$ = new BehaviorSubject<Node[] | null>(null);
    this.node$ = new ReplaySubject<Node | null>(1);
  }

  getNode$(): ReplaySubject<Node | null> {
    return this.node$;
  }

  setNode$(node: Node | null) {
    this.node$.next(node);
  }

  getTree$(): BehaviorSubject<Node[] | null> {
    return this.tree$;
  }

  addRoot(data: any) {
    if (this.root === null) {
      const newRoot = new Node(data);
      this.root = newRoot;
      this.changes.push(newRoot);
      this.tree$.next(this.changes);
    } else {
      console.log('Já tem root');
    }
  }

  addChild(node: Node | null, data: any) {
    if (node) {
      const newChild = new Node(data);
      node.setChild(newChild);
      newChild.setAncestor(node);
      this.changes.push(newChild);

      this.tree$.next(this.changes);
    }
  }
}

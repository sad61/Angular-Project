import { Injectable } from '@angular/core';
import { Node } from '../tree-node/tree-node.component';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BinaryTreeService {
  root!: Node | null;

  node$!: ReplaySubject<Node | null>;

  tree$: BehaviorSubject<Node[] | null>;

  treeDepth!: number;

  changes: Node[] = [];

  nodes: { [depth: number]: Node[] } = {};

  selectedNode!: Node | null;

  constructor() {
    this.tree$ = new BehaviorSubject<Node[] | null>(null);
    this.node$ = new ReplaySubject<Node | null>(1);
  }

  ngOnDestroy() {
    console.log('destrui serviço');
    this.clear();
  }

  clear() {
    this.root?.setChild(null);
    this.root = null;
    this.changes = [];
    this.treeDepth = 0;
    this.nodes = {};
    this.setNode$(null!);
  }

  getNode$(): ReplaySubject<Node | null> {
    return this.node$;
  }

  setNode$(node: Node) {
    this.selectedNode = node;
    this.node$.next(node);
  }

  getTree$(): BehaviorSubject<Node[] | null> {
    return this.tree$;
  }

  getRoot(): Node | null {
    return this.root;
  }

  addRoot(data: any) {
    if (!this.root) {
      const newRoot = new Node(data);
      this.root = newRoot;
      this.changes.push(newRoot);
      this.tree$.next(this.changes);

      this.nodes[0] = [];
      this.nodes[0].push(this.root);
    } else {
      console.log('Já tem root');
    }
  }

  addChild(node: Node | null, data: any) {
    if (node) {
      const newChild = new Node(data);
      node.setChild(newChild);
      newChild.setAncestor(node);
      newChild.setDepth(node.getDepth());

      this.changes.push(newChild);

      const depth = newChild.getDepth();
      if (!this.nodes[depth]) {
        this.nodes[depth] = [];
      }

      // Push the new child to the array at the calculated depth
      this.nodes[depth].push(newChild);
      this.tree$.next(this.changes);
      console.log(this.nodes);
    }
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent {}

export class Node {
  data: any;
  children!: (Node | null)[];
  ancestor!: Node | null;

  constructor(data: any) {
    this.data = data;
    this.children = [];
    this.ancestor = null;
  }

  getData(): any {
    return this.data;
  }

  getChildren(): (Node | null)[] {
    return this.children;
  }

  getAncestor(): Node | null {
    return this.ancestor;
  }

  setData(data: any): void {
    this.data = data;
  }

  setAncestor(ancestor: Node | null): void {
    this.ancestor = ancestor;
  }

  setChild(child: Node | null) {
    this.children.push(child);
  }
}

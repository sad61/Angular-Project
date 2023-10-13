import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
})
export class NodeComponent {
  @Input() node!: Node;
}

export class Node {
  data!: any;
  child: Node | null;
  prev: Node | null;

  constructor(data: any) {
    this.data = data;
    this.child = null;
    this.prev = null;
  }

  getData(): any {
    return this.data;
  }

  getChild(): Node | null {
    return this.child;
  }

  getPrev(): Node | null {
    return this.prev;
  }

  setData(data: any) {
    this.data = data;
  }

  setChild(child: Node) {
    this.child = child;
  }

  setPrev(prev: Node) {
    this.prev = prev;
  }
}

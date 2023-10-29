import { Component, Input } from '@angular/core';
import { BinaryTreeService } from '../service/binary-tree.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent {
  @Input() node!: Node;
  @Input() mainNode!: boolean;
  selectedNode!: Node;
  nodeSubscription!: Subscription;

  constructor(private treeService: BinaryTreeService) {}

  ngOnInit() {
    this.nodeSubscription = this.treeService.getNode$().subscribe((node) => {
      this.selectedNode = node!;
    });
  }

  ngOnDestroy() {
    this.nodeSubscription.unsubscribe();
  }

  updateNode() {
    this.treeService.setNode$(this.node);
  }
}

export class Node {
  data: number;
  left!: Node | null;
  right!: Node | null;
  ancestor!: Node | null;
  depth: number;

  constructor(data: number) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.ancestor = null;
    this.depth = 1;
  }

  getRight(): Node | null {
    return this.right;
  }

  getLeft(): Node | null {
    return this.left;
  }

  getData(): number {
    return this.data;
  }

  getDepth(): number {
    return this.depth;
  }

  setDepth(depth: number) {
    this.depth = depth + 1;
  }

  setData(data: number): void {
    this.data = data;
  }

  setAncestor(ancestor: Node): void {
    this.ancestor = ancestor;
  }

  setLeft(node: Node | null) {
    this.left = node;
  }

  setRight(node: Node | null) {
    this.right = node;
  }
}

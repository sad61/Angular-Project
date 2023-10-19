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

  hasChildren() {
    return this.node?.getChildren()
      ? this.node.getChildren().length > 0
      : false;
  }
}

export class Node {
  data: any;
  children!: Node[];
  ancestor!: Node;
  depth!: number;

  constructor(data: any) {
    this.data = data;
    this.children = [];
    this.depth = 0;
  }

  getData(): any {
    return this.data;
  }

  getDepth(): number {
    return this.depth;
  }

  setDepth(depth: number) {
    this.depth = depth + 1;
  }

  getChildren(): Node[] {
    return this.children;
  }

  getAncestor(): Node {
    return this.ancestor;
  }

  setData(data: any): void {
    this.data = data;
  }

  setAncestor(ancestor: Node): void {
    this.ancestor = ancestor;
  }

  setChild(child: Node | null) {
    if (child !== null) {
      this.children.push(child);
      return;
    }
    this.children = [];
  }
}

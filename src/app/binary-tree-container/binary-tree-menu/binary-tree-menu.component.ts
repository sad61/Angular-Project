import { Component, Input } from '@angular/core';
import { Node } from '../tree-node/tree-node.component';
import { BinaryTreeService } from '../service/binary-tree.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-binary-tree-menu',
  templateUrl: './binary-tree-menu.component.html',
  styleUrls: ['./binary-tree-menu.component.scss'],
})
export class BinaryTreeMenuComponent {
  @Input() node!: Node | null;
  childData: any;
  private nodeSubscription!: Subscription;

  constructor(private treeService: BinaryTreeService) {}

  ngOnInit() {
    this.nodeSubscription = this.treeService.getNode$().subscribe((node) => {
      this.node = node!;
    });
  }

  ngOnDestroy() {
    this.treeService.selectedNode = null;
    this.node = null;
    this.nodeSubscription.unsubscribe();
  }

  addChild() {
    if (this.childData !== '') {
      this.treeService.addChild(this.node, this.childData);
      this.childData = '';
    }
  }

  root() {
    if (this.treeService.getRoot())
      this.treeService.getNode$().next(this.treeService.getRoot()!);
  }

  ancestor() {
    if (this.node?.getAncestor())
      this.treeService.getNode$().next(this.node.getAncestor());
  }
}

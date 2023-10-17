import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Node } from '../tree-node/tree-node.component';
import { BinaryTreeService } from '../service/binary-tree.service';

@Component({
  selector: 'app-binary-tree',
  templateUrl: './binary-tree.component.html',
  styleUrls: ['./binary-tree.component.scss'],
})
export class BinaryTreeComponent {
  rootData: any;
  tree!: Node[] | null;
  private treeSubscription: Subscription;

  constructor(private treeService: BinaryTreeService) {
    this.rootData = '';
    this.treeSubscription = this.treeService.getTree$().subscribe((tree) => {
      this.tree = tree;
    });
  }
  ngOnDestroy() {
    this.treeService.getTree$().unsubscribe();
  }

  addRoot() {
    if (this.rootData) {
      this.treeService.addRoot(this.rootData);
      this.rootData = '';
    }
  }
}

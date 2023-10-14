import { CdkMenu } from '@angular/cdk/menu';
import { Component, Input, ViewChild } from '@angular/core';
import { Node, NodeComponent } from '../node/node.component';
import { ListService } from '../service/list.service';

@Component({
  selector: 'app-nodemenu',
  templateUrl: './nodemenu.component.html',
  styleUrls: ['./nodemenu.component.scss'],
})
export class NodemenuComponent {
  node!: Node;

  constructor(private listService: ListService) {}

  $node = this.listService.getNode().subscribe((node: Node) => {
    console.log(node);
  });
}

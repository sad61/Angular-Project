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
  constructor(private listService: ListService) {}

  get node(): Node {
    return this.listService.getNode();
  }

  changedData: any;
  prevData: any = this.node?.getPrev()?.getData();
  nextData: any = this.node?.getChild()?.getData();
  changeData() {
    this.node.setData(this.changedData);
    this.changedData = '';
  }

  insertNext() {
    this.listService.insertAfter(this.node, this.nextData);
    this.nextData = '';
  }

  insertPrev() {
    this.listService.insertBefore(this.node, this.prevData);
    this.prevData = '';
  }
}

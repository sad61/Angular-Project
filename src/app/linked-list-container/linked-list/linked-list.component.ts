import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { Node } from '../node/node.component';
import { ListService } from '../service/list.service';

@Component({
  selector: 'app-linked-list',
  templateUrl: './linked-list.component.html',
  styleUrls: ['./linked-list.component.scss'],
})
export class LinkedListComponent {
  inputData!: any;

  nodeElements: HTMLElement[] = [];

  selectedNode!: Node; // To store the selected node data

  @ViewChild(NodeComponent) node!: NodeComponent;

  @ViewChild('arrow', { read: ElementRef }) arrow!: ElementRef;

  @ViewChild('nodeWrapper') nodeWrappers!: ElementRef[];

  constructor(private renderer: Renderer2, private listService: ListService) {}

  linkedList = this.listService.linkedList;

  clear() {
    this.linkedList = [];
  }

  onEnterPressed() {
    if (this.inputData)
      this.linkedList.push(this.listService.append(this.inputData));
    this.inputData = '';
  }
}

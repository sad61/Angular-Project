import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { Node } from '../node/node.component';
import { ListService } from '../service/list.service';

@Component({
  selector: 'app-linked-list',
  templateUrl: './linked-list.component.html',
  styleUrls: ['./linked-list.component.css'],
})
export class LinkedListComponent {
  inputData!: any;
  head!: Node;
  tail!: Node;
  size!: number;

  linkedList: Node[] = [];

  nodeElements: HTMLElement[] = [];

  selectedNode!: Node; // To store the selected node data

  @ViewChild(NodeComponent) node!: NodeComponent;

  @ViewChild('arrow', { read: ElementRef }) arrow!: ElementRef;

  @ViewChild('nodeWrapper') nodeWrappers!: ElementRef[];

  constructor(private renderer: Renderer2, private listService: ListService) {}

  clear() {
    this.linkedList = [];
  }

  showNodeInfo(node: any) {
    // Set the selected node information to display in the menu
    this.selectedNode = node;
  }

  onEnterPressed() {
    if (this.inputData) this.linkedList.push(this.append(this.inputData));
    this.inputData = null;
  }

  append(data: any): Node {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      let current = this.head;
      while (current.child !== null) {
        current = current.child;
      }
      current.child = newNode;
      this.tail = newNode; // Update the tail to the new node
    }
    this.size++;
    return newNode;
  }
}

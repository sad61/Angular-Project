import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { Node } from '../node/node.component';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { LinkedListServiceService } from '../service/linked-list-service.service';

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

  @ViewChild(NodeComponent) node!: NodeComponent;

  @ViewChild('arrow', { read: ElementRef }) arrow!: ElementRef;

  @ViewChild('nodeWrapper') nodeWrappers!: ElementRef[];

  nodeElements: HTMLElement[] = [];

  constructor(
    private renderer: Renderer2,
    private listService: LinkedListServiceService
  ) {}

  clear() {
    console.log('oi');
    this.linkedList = [];
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

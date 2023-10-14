import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Node } from '../node/node.component';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor() {}
  node!: Node;
  linkedList: Node[] = [];
  inputData!: any;
  head!: Node;
  tail!: Node;
  size!: number;

  nodeSubject = new ReplaySubject<Node>(1);

  setNode(node: Node) {
    this.node = node;
  }

  getNode() {
    return this.node;
  }

  append(data: any): Node {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.setPrev(this.tail);
      this.tail?.setChild(newNode); // Optional chaining for null check
      this.tail = newNode;
    }
    this.size++;
    return newNode;
  }

  insertBefore(node: Node | null, data: any): Node | null {
    if (!node) return null;

    const newNode = new Node(data);
    const prevNode = node.getPrev();

    newNode.setPrev(prevNode!);
    newNode.setChild(node);

    if (prevNode) {
      prevNode.setChild(newNode);
    } else {
      this.head = newNode;
    }

    node.setPrev(newNode);
    this.size++;

    const nodeIndex = this.linkedList.indexOf(node);
    if (nodeIndex !== -1) {
      this.linkedList.splice(nodeIndex, 0, newNode);
    }

    return newNode;
  }

  insertAfter(node: Node | null, data: any): Node | null {
    if (!node) return null;

    const newNode = new Node(data);
    const nextNode = node.getChild();

    newNode.setPrev(node);
    newNode.setChild(nextNode!);

    if (nextNode) {
      nextNode.setPrev(newNode);
    } else {
      this.tail = newNode;
    }

    node.setChild(newNode);
    this.size++;

    const nodeIndex = this.linkedList.indexOf(node);
    if (nodeIndex !== -1) {
      this.linkedList.splice(nodeIndex + 1, 0, newNode);
    }

    return newNode;
  }

  remove(node: Node): void {}
}

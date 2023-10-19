import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Node } from '../node/node.component';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor() {}
  inputData!: any;
  head!: Node | null;
  tail!: Node | null;
  size!: number;

  node$ = new ReplaySubject<Node | null>(1);
  linkedList$ = new BehaviorSubject<Node[] | null>(null);

  setNode(node: Node | null) {
    this.node$.next(node);
  }

  getNode$() {
    return this.node$;
  }

  getLinkedList$() {
    return this.linkedList$;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(data: any): Node {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.linkedList$.next([newNode]); // Emit the new list with the first node
    } else {
      newNode.setPrev(this.tail);
      this.tail?.setChild(newNode);
      this.tail = newNode;
      const currentList = this.linkedList$.value || [];
      currentList.push(newNode);
      this.linkedList$.next(currentList); // Emit the updated list
    }

    this.size++;
    return newNode;
  }

  insertBefore(node: Node | null, data: any): Node | null {
    if (!node) return null;
    const newNode = new Node(data);
    const currentList = this.linkedList$.value || [];

    if (node === this.head) {
      // Inserting before the current head
      this.head = newNode;
    } else {
      newNode.setPrev(node.getPrev());
      node.getPrev()?.setChild(newNode);
    }

    newNode.setChild(node);
    node.setPrev(newNode);

    const nodeIndex = currentList.findIndex((item) => item === node);
    if (nodeIndex >= 0) {
      currentList.splice(nodeIndex, 0, newNode);
    }

    this.linkedList$.next(currentList);
    this.size++;
    return newNode;
  }

  insertAfter(node: Node | null, data: any): Node | null {
    if (!node) return null;
    const newNode = new Node(data);
    const currentList = this.linkedList$.value || [];

    if (node === this.tail) {
      // Inserting after the current tail
      this.tail = newNode;
      this.tail.setPrev(node);
      node.setChild(this.tail);
    } else {
      newNode.setPrev(node);
      newNode.setChild(node.getChild());
      node.getChild()?.setPrev(newNode);
      node.setChild(newNode);
    }

    const nodeIndex = currentList.findIndex((item) => item === node);
    if (nodeIndex >= 0 && nodeIndex < currentList.length - 1) {
      currentList.splice(nodeIndex + 1, 0, newNode);
    } else {
      currentList.push(newNode);
    }

    this.linkedList$.next(currentList);
    this.size++;
    return newNode;
  }

  // Remove a node from the linked list
  remove(node: Node): void {
    if (!node) return;
    let currentList = this.linkedList$.value || [];
    const nodeIndex = currentList.findIndex((item) => item === node);

    if (nodeIndex >= 0) {
      if (node === this.head) {
        // Removing the current head
        this.head =
          nodeIndex < currentList.length - 1
            ? currentList[nodeIndex + 1]
            : null;
      } else if (node === this.tail) {
        // Removing the current tail
        this.tail = nodeIndex > 0 ? currentList[nodeIndex - 1] : null;
      }

      if (nodeIndex === 0) {
        currentList.shift();
        if (currentList.length > 0) {
          currentList[0].setPrev(null);
        }
      } else if (nodeIndex === currentList.length - 1) {
        currentList.pop();
        if (currentList.length > 0) {
          currentList[currentList.length - 1].setChild(null);
        }
      } else {
        const prevNode = currentList[nodeIndex - 1];
        const nextNode = currentList[nodeIndex + 1];
        prevNode.setChild(nextNode);
        nextNode.setPrev(prevNode);
        currentList.splice(nodeIndex, 1);
      }

      this.linkedList$.next(currentList);
      this.size--;
    }
  }
}

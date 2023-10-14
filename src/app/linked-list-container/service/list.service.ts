import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Node } from '../node/node.component';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor() {}

  nodeSubject = new ReplaySubject<Node>(1);

  setNode(node: Node) {
    this.nodeSubject.next(node);
  }

  getNode() {
    return this.nodeSubject;
  }

  append(node: Node): void {}

  insert(node: Node): void {}

  remove(node: Node): void {}
}

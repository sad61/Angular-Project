import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { Node } from '../node/node.component';
import { ListService } from '../service/list.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-linked-list',
  templateUrl: './linked-list.component.html',
  styleUrls: ['./linked-list.component.scss'],
})
export class LinkedListComponent {
  inputData: any;
  linkedList: Node[] | null;
  private linkedListSubscription: Subscription;

  constructor(private listService: ListService) {
    this.inputData = '';
    this.linkedList = null;
    this.linkedListSubscription = this.listService
      .getLinkedList$()
      .subscribe((list) => {
        this.linkedList = list;
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.linkedListSubscription.unsubscribe();
  }

  clear() {
    if (this.linkedList) {
      for (const node of this.linkedList) {
        node.setChild(null);
        node.setPrev(null);
      }
      this.linkedList.length = 0;
      this.listService.setNode(null);
    }
  }

  onEnterPressed() {
    if (this.inputData) {
      this.listService.append(this.inputData);
      this.inputData = '';
    }
  }
}

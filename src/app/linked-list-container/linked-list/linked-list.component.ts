import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { Node } from '../node/node.component';
import { ListService } from '../service/list.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-linked-list',
  templateUrl: './linked-list.component.html',
  styleUrls: ['./linked-list.component.scss'],
})
export class LinkedListComponent {
  inputData: any;
  linkedList: Node[] | null;
  searchData: any;
  isResolving: boolean = false;

  private linkedListSubscription: Subscription;

  constructor(private listService: ListService, private snackBar: MatSnackBar) {
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
    this.clear();
  }

  clear() {
    if (this.linkedList) {
      for (const node of this.linkedList) {
        node.setChild(null);
        node.setPrev(null);
      }
      this.linkedList = null;
      this.listService.setNode(null);
      this.listService.clear();
    }
  }

  onEnterPressed() {
    if (this.inputData) {
      this.listService.append(this.inputData);
      this.inputData = '';
    }
  }

  async searchNode() {
    if (this.isResolving) {
      this.snackBar.open(`Aguarde a procura terminar.`, 'Dismiss');
      return;
    }
    if (this.searchData) {
      this.isResolving = true;

      let data = this.searchData;
      this.searchData = '';

      let index = 0;
      let currentNode = this.listService.head;
      let flag = false;

      while (currentNode) {
        this.listService.setNode(currentNode);
        if (currentNode.getData() === data) {
          flag = true;
          this.snackBar.open(
            `Node '${data}' encontrado no index: ${index}.`,
            'Dismiss'
          );
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
        currentNode = currentNode.getChild();
        index++;
      }

      if (!flag) {
        this.snackBar.open(`Node não encontrado.`, 'Dismiss');
      }
    }
    this.isResolving = false;
  }
}

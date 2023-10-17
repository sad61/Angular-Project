import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Node } from '../node/node.component';
import { ListService } from '../service/list.service';
import { ThemeService } from 'src/app/app-nav/service/theme.service';

@Component({
  selector: 'app-nodemenu',
  templateUrl: './nodemenu.component.html',
  styleUrls: ['./nodemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodemenuComponent implements OnInit, OnDestroy {
  @Input() node: Node | null;
  @Input() linkedList: Node[] | null;
  changedData: any;
  prevData: any;
  nextData: any;

  private nodeSubscription!: Subscription;
  private linkedListSubscription!: Subscription;

  constructor(
    private listService: ListService,
    private themeService: ThemeService
  ) {
    this.node = null;
    this.linkedList = null;
    this.changedData = '';
    this.prevData = null;
    this.nextData = null;
  }

  ngOnInit() {
    this.themeService.getActiveTheme();
    this.nodeSubscription = this.listService.getNode$().subscribe((node) => {
      this.node = node;
      this.prevData = this.node?.getPrev()?.getData();
      this.nextData = this.node?.getChild()?.getData();
    });

    this.linkedListSubscription = this.listService
      .getLinkedList$()
      .subscribe((list) => {
        this.linkedList = list;
      });
  }

  ngOnDestroy() {
    this.nodeSubscription.unsubscribe();
    this.linkedListSubscription.unsubscribe();
  }

  head() {
    this.listService.setNode(this.listService.head);
  }

  tail() {
    this.listService.setNode(this.listService.tail);
  }

  remove() {
    if (this.node) {
      this.listService.remove(this.node);
      const newNode = this.node?.getChild() || this.node?.getPrev();
      this.listService.setNode(newNode);
    }
  }

  changeData() {
    if (this.node) {
      this.node.setData(this.changedData);
      this.changedData = '';
    }
  }

  insertNext() {
    if (this.node) {
      this.listService.insertAfter(this.node, this.nextData);
      this.nextData = '';
    }
  }

  insertPrev() {
    if (this.node) {
      this.listService.insertBefore(this.node, this.prevData);
      this.prevData = '';
    }
  }
}

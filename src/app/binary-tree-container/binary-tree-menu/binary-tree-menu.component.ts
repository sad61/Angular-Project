import { Component, HostListener, Input } from '@angular/core';
import { Node } from '../tree-node/tree-node.component';
import { BinaryTreeService } from '../service/binary-tree.service';
import { Subscription } from 'rxjs';
import { CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-binary-tree-menu',
  templateUrl: './binary-tree-menu.component.html',
  styleUrls: ['./binary-tree-menu.component.scss'],
})
export class BinaryTreeMenuComponent {
  @Input() node!: Node | null;
  childData: any;
  private isDragging = false;
  private startMouseX!: number;
  private startMouseY!: number;
  private startScrollX!: number;
  private startScrollY!: number;

  private nodeSubscription!: Subscription;

  constructor(private treeService: BinaryTreeService) {}

  ngOnInit() {
    this.nodeSubscription = this.treeService.getNode$().subscribe((node) => {
      this.node = node!;
    });
  }

  ngOnDestroy() {
    this.treeService.selectedNode = null;
    this.node = null;
    this.nodeSubscription.unsubscribe();
  }

  addChild() {
    if (this.childData !== '') {
      this.treeService.insert(this.childData);
      this.childData = '';
    }
  }

  root() {
    if (this.treeService.getRoot())
      this.treeService.getNode$().next(this.treeService.getRoot()!);
  }

  ancestor() {
    if (this.node?.getAncestor())
      this.treeService.getNode$().next(this.node.getAncestor());
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.startMouseX;
      const deltaY = event.clientY - this.startMouseY;

      // Adjust scroll position
      this.scrollContainer.scrollLeft = this.startScrollX - deltaX;
      this.scrollContainer.scrollTop = this.startScrollY - deltaY;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp() {
    if (this.isDragging) {
      this.stopDrag();
    }
  }

  get scrollContainer() {
    return document.querySelector('.scroll-container') as HTMLElement;
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startMouseX = event.clientX;
    this.startMouseY = event.clientY;
    this.startScrollX = this.scrollContainer.scrollLeft;
    this.startScrollY = this.scrollContainer.scrollTop;
  }

  stopDrag() {
    this.isDragging = false;
  }
}

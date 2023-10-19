import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragScroll]',
})
export class DragScrollDirective {
  private isDragging = false;
  private startX: number | null = null;
  private scrollLeft: number = 0;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.clientX;
    const walkX = (x - (this.startX || 0)) * 3; // Adjust the multiplier for desired scroll speed
    this.el.nativeElement.scrollLeft = this.scrollLeft - walkX;
  }
}

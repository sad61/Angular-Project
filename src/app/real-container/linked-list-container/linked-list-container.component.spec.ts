import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedListContainerComponent } from './linked-list-container.component';

describe('LinkedListContainerComponent', () => {
  let component: LinkedListContainerComponent;
  let fixture: ComponentFixture<LinkedListContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedListContainerComponent]
    });
    fixture = TestBed.createComponent(LinkedListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

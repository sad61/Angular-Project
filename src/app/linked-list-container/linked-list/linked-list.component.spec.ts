import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedListComponent } from './linked-list.component';

describe('LinkedListComponent', () => {
  let component: LinkedListComponent;
  let fixture: ComponentFixture<LinkedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedListComponent]
    });
    fixture = TestBed.createComponent(LinkedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

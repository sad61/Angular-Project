import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryTreeContainerComponent } from './binary-tree-container.component';

describe('BinaryTreeContainerComponent', () => {
  let component: BinaryTreeContainerComponent;
  let fixture: ComponentFixture<BinaryTreeContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinaryTreeContainerComponent]
    });
    fixture = TestBed.createComponent(BinaryTreeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryTreeMenuComponent } from './binary-tree-menu.component';

describe('BinaryTreeMenuComponent', () => {
  let component: BinaryTreeMenuComponent;
  let fixture: ComponentFixture<BinaryTreeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinaryTreeMenuComponent]
    });
    fixture = TestBed.createComponent(BinaryTreeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

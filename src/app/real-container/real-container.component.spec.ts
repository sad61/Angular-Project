import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealContainerComponent } from './real-container.component';

describe('RealContainerComponent', () => {
  let component: RealContainerComponent;
  let fixture: ComponentFixture<RealContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealContainerComponent],
    });
    fixture = TestBed.createComponent(RealContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

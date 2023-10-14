import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodemenuComponent } from './nodemenu.component';

describe('NodemenuComponent', () => {
  let component: NodemenuComponent;
  let fixture: ComponentFixture<NodemenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodemenuComponent]
    });
    fixture = TestBed.createComponent(NodemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

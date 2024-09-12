import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlContainerComponent } from './sql-container.component';

describe('SqlContainerComponent', () => {
  let component: SqlContainerComponent;
  let fixture: ComponentFixture<SqlContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SqlContainerComponent]
    });
    fixture = TestBed.createComponent(SqlContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

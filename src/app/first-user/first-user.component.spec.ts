import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstUserComponent } from './first-user.component';

describe('FirstUserComponent', () => {
  let component: FirstUserComponent;
  let fixture: ComponentFixture<FirstUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstUserComponent]
    });
    fixture = TestBed.createComponent(FirstUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

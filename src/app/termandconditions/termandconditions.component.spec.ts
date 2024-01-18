import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermandconditionsComponent } from './termandconditions.component';

describe('TermandconditionsComponent', () => {
  let component: TermandconditionsComponent;
  let fixture: ComponentFixture<TermandconditionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermandconditionsComponent]
    });
    fixture = TestBed.createComponent(TermandconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

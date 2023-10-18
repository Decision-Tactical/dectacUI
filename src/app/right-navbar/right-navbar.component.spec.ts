import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightNavbarComponent } from './right-navbar.component';

describe('RightNavbarComponent', () => {
  let component: RightNavbarComponent;
  let fixture: ComponentFixture<RightNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightNavbarComponent]
    });
    fixture = TestBed.createComponent(RightNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

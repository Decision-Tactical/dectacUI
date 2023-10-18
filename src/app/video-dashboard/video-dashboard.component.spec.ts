import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDashboardComponent } from './video-dashboard.component';

describe('VideoDashboardComponent', () => {
  let component: VideoDashboardComponent;
  let fixture: ComponentFixture<VideoDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoDashboardComponent]
    });
    fixture = TestBed.createComponent(VideoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

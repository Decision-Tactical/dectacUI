import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchExistingAccountComponent } from './fetch-existing-account.component';

describe('FetchExistingAccountComponent', () => {
  let component: FetchExistingAccountComponent;
  let fixture: ComponentFixture<FetchExistingAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FetchExistingAccountComponent]
    });
    fixture = TestBed.createComponent(FetchExistingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

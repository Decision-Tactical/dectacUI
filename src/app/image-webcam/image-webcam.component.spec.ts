import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWebcamComponent } from './image-webcam.component';

describe('ImageWebcamComponent', () => {
  let component: ImageWebcamComponent;
  let fixture: ComponentFixture<ImageWebcamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageWebcamComponent]
    });
    fixture = TestBed.createComponent(ImageWebcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

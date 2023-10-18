import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoThumbnailComponent } from './video-thumbnail.component';

describe('VideoThumbnailComponent', () => {
  let component: VideoThumbnailComponent;
  let fixture: ComponentFixture<VideoThumbnailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoThumbnailComponent]
    });
    fixture = TestBed.createComponent(VideoThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

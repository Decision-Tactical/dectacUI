import { Component, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { VIDEO_DATA } from '../../assets/video-data';
import { VideoPopupComponent } from '@app/video-popup/video-popup.component';

@Component({
  selector: 'app-video-thumbnail',
  templateUrl: './video-thumbnail.component.html',
  styleUrls: ['./video-thumbnail.component.css'],
})
export class VideoThumbnailComponent implements OnInit {
  videos = VIDEO_DATA;
  modalRef: MdbModalRef<VideoPopupComponent> | null = null;
  videoGroups: any[] = [];
  constructor(private modalService: MdbModalService) {

  }

  ngOnInit(): void {
    // Group the videos into sets of three
    for (let i = 0; i < VIDEO_DATA.length; i += 3) {
      this.videoGroups.push(VIDEO_DATA.slice(i, i + 3));
    }
  }
  
  openVideoPopupModal(videoid: any, videotitle: any) {
    this.modalRef = this.modalService.open(VideoPopupComponent, {
      data: { title: videotitle, videoid: videoid },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VIDEO_DATA } from '../../assets/video-data';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { DashboardService } from '@app/_services';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-video-popup',
  templateUrl: './video-popup.component.html',
  styleUrls: ['./video-popup.component.css'],
})
export class VideoPopupComponent implements OnInit {
  title: string | null = null;
  videoid: number | undefined;
  videoUrl: string | undefined;
  error?: string;

  constructor(public modalRef: MdbModalRef<VideoPopupComponent>, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.videoUrl = `${environment.apiUrl}/videos/${this.videoid}`;
  }
}

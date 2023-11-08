import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VIDEO_DATA } from '../../assets/video-data';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { DashboardService } from '@app/_services';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video-popup',
  templateUrl: './video-popup.component.html',
  styleUrls: ['./video-popup.component.css'],
})
export class VideoPopupComponent implements OnInit {
  title: string | null = null;
  videoid: any | undefined;
  videoUrl: any | undefined;
  error?: string;

  constructor(private http: HttpClient, public modalRef: MdbModalRef<VideoPopupComponent>, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {    
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoid); //`${environment.apiUrl}/videos/${this.videoid}`;
  }

  downloadVideo() {
    const videoUrl = this.videoid; // Replace with the actual URL of the video
    this.http.get(videoUrl, { responseType: 'blob' }).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'video/mp4' }); // Adjust the MIME type as needed
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video.mp4'; // Specify the desired filename for the downloaded video
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

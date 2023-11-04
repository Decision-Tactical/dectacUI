import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoPopupComponent } from '@app/video-popup/video-popup.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AccountService, DashboardService } from '@app/_services';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-video-dashboard',
  templateUrl: './video-dashboard.component.html',
  styleUrls: ['./video-dashboard.component.css']
})
export class VideoDashboardComponent  implements OnInit, OnDestroy {
  modalRef: MdbModalRef<VideoPopupComponent> | null = null;
  tableData: any[] = [];
  cols: any[] = [];
  success?: string;
  error?: string;
  successHide?: boolean = true;
  pickerFrom: any;
  pickerTo: any;
  minDate: any = moment('2020=1-1', 'YYYY-MM-DD').local();
  maxDate: any = moment().local();
  dateControl = new FormControl();
  selectedVideo!:any;

  constructor(
    private modalService: MdbModalService,
    private dashboardService: DashboardService) {
    this.pickerFrom = '';
    this.pickerTo = '';
  }  

  openModal(videoid: any) {
    this.modalRef = this.modalService.open(VideoPopupComponent, {
      data: { videoid: videoid },
    });
  }

  startDateChanged(event: any) {
    this.pickerFrom = moment(event.value).local();
  }

  endDateChanged(event: any) {
    this.pickerTo = moment(event.value).local();
  }

  callAPIToGetData() {
    this.cols = [];
    this.tableData = [];
    // API call for json data
    const screeName = 'videotab';
    this.dashboardService.getColumnData(screeName)
      .pipe(
        switchMap((data: any) => {
          if (data.tableColumnNameSetting.length > 0) {
            this.cols = data.tableColumnNameSetting[0];
            if (!(this.pickerFrom && this.pickerTo)) {
              this.pickerTo = '';
              this.pickerFrom = '';
            }
            const dateobject = { 'toDate': this.pickerTo, 'fromDate': this.pickerFrom };
            return this.dashboardService.getVideoDashboardTableData(dateobject);
          } else {
            return this.error = 'No Data Found';
          }
        })
      ).subscribe((response: any) => {
        if (response.errorinfodvocollection.length > 0) {
          if (!!response.errorinfodvocollection[0].error) {
            this.error = response.errorinfodvocollection[0].error;
          }
        }
        else {
          if (response.videosdetailscollection.length > 0) {
            this.tableData = response.videosdetailscollection[0];
          } else {
            this.error = 'No Data Found';
          }
        }
        setTimeout(() => {
          this.success = '';
          this.error = '';
        }, 3000);
      });
  }

  ngOnInit() {  
    this.callAPIToGetData();
  }

  onDateClick() {
    this.callAPIToGetData();
  }

  onRowSelectVideo(event: any) {
    this.modalRef = this.modalService.open(VideoPopupComponent, {
      data: { videoid: event.data.videoid },
    });
    // window.open(event.data.videopath, "_blank");
}


// Unsubscribe from login state on destroy to prevent memory leak
ngOnDestroy(): void {
  this.modalRef = null;
  this.cols = [];
  this.tableData = [];
  this.pickerTo = '';
  this.pickerFrom = '';
}

}
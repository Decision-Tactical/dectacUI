import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AccountService, DashboardService } from '@app/_services';
import { VideoThumbnailComponent } from '@app/video-thumbnail/video-thumbnail.component';
import { FormControl } from '@angular/forms';
import { DashboardData } from '@app/_models';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any;
  options: any;
  modalRef: MdbModalRef<ModalComponent> | null = null;
  jsonData: any;
  tableData: any[] = [];
  cols: any[] = [];
  success?: string;
  error?: string;
  successHide?: boolean = true;
  pickerFrom: any;
  pickerTo: any;
  minDate: any = moment('2020=1-1', 'YYYY-MM-DD').local();
  maxDate: any = moment().local();

  constructor(
    private modalService: MdbModalService,
    private accountService: AccountService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute) {
    this.pickerFrom = '';
    this.pickerTo = '';
  }

  dateControl = new FormControl();

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { title: 'Credit History' },
    });

  }

  logout() {
    this.accountService.logout();
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
    const screeName = 'dashboard';
    this.dashboardService.getColumnData(screeName)
      .pipe(
        switchMap((data: any) => {
          if (data.tableColumnNameSetting.length > 0) {
            this.cols = data.tableColumnNameSetting;
            if (!(this.pickerFrom && this.pickerTo)) {
              this.pickerTo = '';
              this.pickerFrom = '';
            }
            const dateobject = { 'toDate': this.pickerTo, 'fromDate': this.pickerFrom };
            return this.dashboardService.getDashboardTableData(dateobject);
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
          if (response.activitiesdetailscollection.length > 0) {
            this.tableData = response.activitiesdetailscollection;
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
    // show success message after registration
    if (this.route.snapshot.queryParams.loginSuccess) {
      this.success = 'Login Success';
      setTimeout(() => {
        this.successHide = false;
      }, 3000);
    }
    this.callAPIToGetData();

    // Graph configuration
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

  }

  onDateClick() {
    this.callAPIToGetData();
  }

}

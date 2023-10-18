import { Component, OnInit } from '@angular/core';
// import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { DashboardData } from '@app/_models';
import { DashboardService } from '@app/_services';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  tableData: DashboardData[] = [];
  membershipType: any;
  cols: any[] = [];
  error?: string;
  constructor(
    // public modalRef: MdbModalRef<ModalComponent>,
    private dashboardService: DashboardService) { }
  ngOnInit(): void {
    // API call for json data
    this.dashboardService.getColumnDataForCredit().subscribe((data) => {
      this.cols = data;
    });

    this.dashboardService.getDataForCredit().subscribe({
      next: (data: any) => {
        if (data.errorinfodvocollection.length > 0) {
          if (!!data.errorinfodvocollection[0].error) {
            this.error = data.errorinfodvocollection[0].error;
          }
        } else {
          if (data.memberdetailscollection.length > 0) {
            this.membershipType = data.memberdetailscollection[0].membershipType;
          }
          if (data.creditdetailscollection.length > 0) {
            this.tableData = data.creditdetailscollection;
          } else {
            this.error = 'No data Found';
          }
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      },
      error: error => {
        this.error = error;
      }
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { AccountService } from "./account.service";

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private jsonColDataForCreditUrl = 'assets/columnforcredit.json';
  user:any;

  constructor(
    private accountService: AccountService,
    private http: HttpClient
  ) {
    this.user = this.accountService.userValue;
  }
  getColumnData(data:any): Observable<any> {
    const screenName = data;
    return this.http.post(`${environment.apiUrl}/dashboard/getDashboardColumnData`, {screenName});
  }

  getDataForCredit(): Observable<any> {
    const email = this.user.email;
    const dtacid = this.user.serial_number;
    return this.http.post(`${environment.apiUrl}/dashboard/getCreditTableData`, {email, dtacid });
  }

  getColumnDataForCredit(): Observable<any> {
    return this.http.get(this.jsonColDataForCreditUrl);
  }
  getDashboardTableData(data: any) {
    let fromDate: any = data.fromDate;
    let toDate: any = data.toDate;
    if (!(toDate && toDate)) {
      toDate = '';
      fromDate = '';
    }
    const email = this.user.email;
    const dtacid = this.user.serial_number;
    return this.http.post(`${environment.apiUrl}/dashboard/getDashboardTableData`, { email, dtacid, fromDate, toDate });
  }
  getVideoDashboardTableData(data: any) {
    let fromDate: any = data.fromDate;
    let toDate: any = data.toDate;
    if (!(toDate && toDate)) {
      toDate = '';
      fromDate = '';
    }
    const email = this.user.email;
    const dtacid = this.user.serial_number;
    return this.http.post(`${environment.apiUrl}/videos/getVideoDashboardTableData`, { email, dtacid, fromDate, toDate });
  }
}
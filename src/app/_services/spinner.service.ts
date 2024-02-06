// spinner.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
//   spinnerStatus = new BehaviorSubject<boolean>(false);
spinnerStatus:boolean = false;

  getSpinnerStatus() {
    return this.spinnerStatus;
  }

  startSpinner() {
    // this.spinnerStatus.next(true);
    this.spinnerStatus = true;
  }

  stopSpinner() {
    // this.spinnerStatus.next(false);
    this.spinnerStatus = false;
  }
}

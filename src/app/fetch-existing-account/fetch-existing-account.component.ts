import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';
import { AccountService } from '../_services';
import * as moment from 'moment';

@Component({
  selector: 'app-fetch-existing-account',
  templateUrl: './fetch-existing-account.component.html',
  styleUrls: ['./fetch-existing-account.component.css']
})
export class FetchExistingAccountComponent implements OnInit {
  retriveForm!: FormGroup;
  loading = false;
  otpinitiated = false;
  submitted = false;
  error?: string;
  success?: string;
  minDate: any = moment('1950-1-1', 'YYYY-MM-DD').local();
  maxDate: any = moment().local();
  mobileNumber!: string;
  otp!: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {

  }

  ngOnInit() {
    this.retriveForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      birthDate: ['']
    });
  }

  // convenience getter for easy access to retriveForm fields
  get f() { return this.retriveForm.controls; }

  onRetriveFormSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.error = '';
    this.success = '';
    // stop here if retriveForm is invalid
    if (this.retriveForm.invalid) {
      return;
    }

    this.loading = true;
    const accountDetails: any = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      emailAddress: this.f.emailAddress.value,
      phoneNumber: this.f.phoneNumber.value,
      birthDate: this.f.birthDate.value,
      screenName: 'retriveAccount'
    }

    this.accountService.retriveAccount(accountDetails).subscribe({
      next: (response: any) => {
        if (response.errorinfodvocollection.length > 0) {
          this.accountService.setAccountDetails(response.errorinfodvocollection[0]);
          this.loading = false;
          this.router.navigate(['/new-user'], { queryParams: { updatemode: false } });
        } else {
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          // this.router.navigateByUrl(returnUrl);
          this.accountService.setAccountDetails(response.accountdetaildvocollection[0]);
          this.router.navigate(['/new-user'], { queryParams: { updatemode: true } });
        }
      },
      error: error => {
        this.error = error;
        this.loading = false;
      }
    });
  }
  validateMobileNum(): boolean {
    let message: boolean = false;
    if (!!this.mobileNumber && this.mobileNumber.trim() !== '' && this.mobileNumber.length === 10) {
      message = true;
    } else if (!this.mobileNumber || this.mobileNumber.trim() === '') {
      this.error = 'Mobile Number is required';
      message = false;
    } else if (!!this.mobileNumber && this.mobileNumber.length < 10) {
      this.error = 'Mobile Number should be 10 digits';
      message = false;
    }
    if (!message) {
      setTimeout(() => {
        this.success = '';
        this.error = '';
      }, 5000);
      return false;
    } else {
      return true;
    }
  }

  sendOtp() {
    if (this.validateMobileNum()) {
      this.accountService.generateOtp(this.mobileNumber).subscribe({
        next: (response: any) => {
          if (response.generateotpdvocollection.length > 0) {
            this.success = response.generateotpdvocollection[0].success;
            this.otpinitiated = true;
          } else {
            this.otpinitiated = false;
            this.error = response.errorinfodvocollection[0].error;
          }
          setTimeout(() => {
            this.success = '';
            this.error = '';
          }, 5000);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
    }   
  }

  verifyOtp() {
    if (this.validateMobileNum() && !!this.otp && this.otp.trim() !== '') {
    this.accountService.verifyOtp(this.mobileNumber, this.otp).subscribe({
      next: (response: any) => {
        if (response.verifyotpdvocollection.length > 0) {
          this.success = response.verifyotpdvocollection[0].success;
          this.accountService.setAccountDetails(response.verifyotpdvocollection[0]);
          this.router.navigate(['/new-user'], { queryParams: { updatemode: true } });
        } else {
          this.error = response.errorinfodvocollection[0].error;
        }
        setTimeout(() => {
          this.success = '';
          this.error = '';
        }, 5000);
      },
      error: error => {
        this.error = error;
        this.loading = false;
      }
    });
  } else {
    this.error = 'OTP is required';
    setTimeout(() => {
      this.error = '';
    }, 5000);
  }
  }
  changeMobileNumber(){
    console.log('change');
    this.otpinitiated = false;
  }
}
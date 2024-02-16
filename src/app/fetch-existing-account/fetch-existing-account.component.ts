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
  submitted = false;
  error?: string;
  success?: string;
  minDate: any = moment('1950-1-1', 'YYYY-MM-DD').local();
  maxDate: any = moment().local();
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
      phoneNumber:[''],
      birthDate:['']
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
    const accountDetails:any = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      emailAddress: this.f.emailAddress.value,
      phoneNumber:this.f.phoneNumber.value,
      birthDate:this.f.birthDate.value,
      screenName:'retriveAccount'
    }
    
    this.accountService.retriveAccount(accountDetails).subscribe({
      next: (response: any) => {
        if (response.errorinfodvocollection.length>0) {
          this.error = response.errorinfodvocollection[0].NotFound;
          this.loading = false;
          this.router.navigate(['/new-user']);
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
}
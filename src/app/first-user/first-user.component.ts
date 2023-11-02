import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-first-user',
  templateUrl: './first-user.component.html',
  styleUrls: ['./first-user.component.css']
})
export class FirstUserComponent implements OnInit {
  activeIndex: number = 0;
  // emailForm!: FormGroup;
  dtacIdForm!: FormGroup;
  phoneForm!: FormGroup;
  loading = false;
  dtacIdFormSubmitted = false;
  phoneFormSubmitted = false;
  error?: string;
  success?: string;
  selectedIndex: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private emailService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }
  ngOnInit() {
    // this.emailForm = this.formBuilder.group({
    //   email: ['', [Validators.required, Validators.email]]
    // });
    this.dtacIdForm = this.formBuilder.group({
      dtacid: ['', [Validators.required]]
    });

    this.phoneForm = this.formBuilder.group({
      phone: ['', [Validators.required]]
    });
    // show success message after registration
    if (this.route.snapshot.queryParams.registered) {
      this.success = 'Verification email sent successfully';
    }
  }

  // get fe() { return this.emailForm.controls; }
  get fd() { return this.dtacIdForm.controls; }
  get fp() { return this.phoneForm.controls; }

  onLinkClick(eventData: any) {
    console.log('eventData-->', eventData.index);
    this.selectedIndex = eventData.index;
  }
  sendVerification() {
    if (this.selectedIndex === 1) {
      this.sendVerificationPhone();
    } else {
      this.sendVerificationDtacId();
    }
  }
  // sendVerificationEmail() {
  //   this.submitted = true;

  //   // reset alerts on submit
  //   this.error = '';
  //   this.success = '';

  //   // stop here if form is invalid
  //   if (this.emailForm.invalid) {
  //     return;
  //   }

  //   this.loading = true;
  //   const userEmail = this.f.email.value; // Replace with the user's email

  //   this.emailService.sendVerificationEmail(userEmail)
  //     .pipe(first())
  //     .subscribe({
  //       next: (response: any) => {
  //         if (response.errorinfodvocollection.length > 0) {
  //           this.error = response.errorinfodvocollection[0].error;
  //           this.loading = false;
  //         } else {
  //           console.log('response', response);
  //           this.router.navigate(['../login'], { queryParams: { registered: response.successMessage[0].message } });
  //         }
  //       },
  //       error: error => {
  //         this.error = error;
  //         this.loading = false;
  //       }
  //     });
  // }
  sendVerificationDtacId() {
    this.dtacIdFormSubmitted = true;
    // reset alerts on submit
    this.error = '';
    this.success = '';
    // stop here if form is invalid
    if (this.dtacIdForm.invalid) {
      return;
    }
    this.loading = true;
    const userDtacId = this.fd.dtacid.value; // Replace with the user's email
    this.callAPIServices({'dtacid':userDtacId} );
  }

  sendVerificationPhone() {
    this.phoneFormSubmitted = true;
    // reset alerts on submit
    this.error = '';
    this.success = '';
    // stop here if form is invalid
    if (this.phoneForm.invalid) {
      return;
    }
    this.loading = true;
    const userPhone = this.fp.phone.value; // Replace with the user's email
    this.callAPIServices({'phone':userPhone});
  }

  keyPressOnPhone(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.key != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  callAPIServices(data: any) {
    this.emailService.sendVerificationEmail(data)
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          if (response.errorinfodvocollection.length > 0) {
            this.error = response.errorinfodvocollection[0].error;
            this.loading = false;
          } else {
            console.log('response', response);
            this.router.navigate(['../login'], { queryParams: { registered: response.successMessage[0].message } });
          }
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}

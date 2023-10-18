import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  error?: string;
  success?: string;
  constructor(
    private formBuilder: FormBuilder,
    private emailService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // show success message after registration
    if (this.route.snapshot.queryParams.registered) {
      this.success = 'Verification email sent successfully';
  }
  }

  get f() { return this.form.controls; }

  forgotPassword() {
    this.submitted = true;

    // reset alerts on submit
    this.error = '';
    this.success = '';

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const userEmail = this.f.email.value; // Replace with the user's email

    this.emailService.forgotPasswordEmail(userEmail)
      .pipe(first())
      .subscribe({
        next: (response:any) => {
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


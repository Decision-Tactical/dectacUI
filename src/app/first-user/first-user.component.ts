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
  emailForm!: FormGroup;
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
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // show success message after registration
    if (this.route.snapshot.queryParams.registered) {
      this.success = 'Verification email sent successfully';
    }
  }

  get f() { return this.emailForm.controls; }

  sendVerificationEmail() {
    this.submitted = true;

    // reset alerts on submit
    this.error = '';
    this.success = '';

    // stop here if form is invalid
    if (this.emailForm.invalid) {
      return;
    }

    this.loading = true;
    const userEmail = this.f.email.value; // Replace with the user's email

    this.emailService.sendVerificationEmail(userEmail)
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

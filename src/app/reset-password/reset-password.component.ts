import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  public showPasswordOld: boolean = false;
  public showPasswordNew: boolean = false;
  public showPasswordConfirm: boolean = false;
  form!: FormGroup;
  loading = false;
  submitted = false;
  error?: string;
  success?: string;
  // user:any;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,) { }

  ngOnInit() {
    // this.user = this.accountService.userValue;
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  changePassword() {
    this.submitted = true;
    // reset alerts on submit
    this.error = '';
    this.success = '';
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    // Add your password change logic here, e.g., send an HTTP request to your server.
    if (this.f.newPassword.value !== this.f.confirmPassword.value) {
      // Passwords match, proceed with changing the password
      this.error = 'New password and confirm password do not match.'
      setTimeout(() => {
        this.success = '';
        this.error = '';
      }, 3000);
      this.loading = false;
    } else {
      this.accountService.resetPassword(this.f.oldPassword.value, this.f.newPassword.value).subscribe({
        next: (response: any) => {
          if (!!response.error) {
            this.error = response.error;
            this.loading = false;
          } else {
            this.success = response.message;
            this.loading = false;
            setTimeout(() => {
              this.accountService.logout();
              this.success = '';
              this.error = '';
            }, 3000);
          }
        },
        error: (error: string | undefined) => {
          this.error = error;
          this.loading = false;
        }
      });
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  public togglePasswordVisibility(data: string): void {
    if (data === 'oldPassword') {
      this.showPasswordOld = !this.showPasswordOld;
    }
    if (data === 'newPassword') {
      this.showPasswordNew = !this.showPasswordNew;
    }
    if (data === 'confirmPassword') {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';
import { AccountService } from '../_services';
import { SpinnerService } from '@app/_services/spinner.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public showPassword: boolean = false;
    form!: FormGroup;
    loading = false;
    submitted = false;
    error?: string;
    success?: string;
    user: any;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private spinnerService:SpinnerService,
        private accountService: AccountService
    ) {
        // redirect to home if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        
        // show success message after registration
        if (this.route.snapshot.queryParams.registered) {
            this.success = this.route.snapshot.queryParams.registered;
            setTimeout(() => {
                this.success = '';
                this.error = '';
            }, 3000);
        }
        // show success message after registration
        if (!!this.route.snapshot.queryParams.parsedData) {
            this.form.patchValue({
                username: this.route.snapshot.queryParams.parsedData
                // set other form fields if needed...
            });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.error = '';
        this.success = '';
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.spinnerService.startSpinner();
        this.accountService.login(this.f.username.value, this.f.password.value).subscribe({
            next: (response: any) => {
                this.spinnerService.stopSpinner();
                if (!!response.error) {
                    this.error = response.error;
                    this.loading = false;
                } else {
                    // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    // this.router.navigateByUrl(returnUrl);
                    this.router.navigate(['/'], { queryParams: { loginSuccess: true } });
                }
            },
            error: error => {
                this.error = error;
                this.loading = false;
            }
        });
    }

    public togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    logout() {
        this.accountService.logout();
    }
}
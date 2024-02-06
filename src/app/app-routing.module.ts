import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers';
// import { RegisterComponent } from './register/register.component';
import { FirstUserComponent } from './first-user/first-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VideoPopupComponent } from './video-popup/video-popup.component';
import { ProfileComponent } from './profile/profile.component';
import { VideoDashboardComponent } from './video-dashboard/video-dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ModalComponent } from './modal/modal.component';
import { NewUserRegistrationComponent } from './new-user-registration/new-user-registration.component';
import { FetchExistingAccountComponent } from './fetch-existing-account/fetch-existing-account.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'new-user', component: NewUserRegistrationComponent },
  { path: 'fetch-existing-account', component: FetchExistingAccountComponent },
  { path: 'first-user', component: FirstUserComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Dashboard' } },
  { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Change Password' } },
  { path: 'getcredits', component: ModalComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Credits' } },
  { path: 'video', component: VideoDashboardComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Videos' } },
  { path: 'video/:id', component: VideoPopupComponent, canActivate: [AuthGuard] },
  { path: 'getprofile', component: ProfileComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Profile' } },
  { path: '**', component: NotFoundComponent } // Catch-all route should be the last
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

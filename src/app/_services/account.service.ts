import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Login, Reset } from '../_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private accountDetailsSubject = new BehaviorSubject<string>('');
  accountDetails$ = this.accountDetailsSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<Login>(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe(map(user => {
        let erroCollection = user.errorinfodvocollection;
        if (erroCollection.length > 0) {
          return user.errorinfodvocollection[0];
        } else {
          const userDetailsCollection: User = user.userdetaildvocollection[0];
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem('user', JSON.stringify(userDetailsCollection));
          this.userSubject.next(userDetailsCollection);
          this.isLoggedInCheck();
          return userDetailsCollection;
        }
      }));
  }

  resetPassword(oldpassword: string, newpassword: string): any {
    if (!!this.userValue) {
      const email = this.userValue.email;
      return this.http.post<Reset>(`${environment.apiUrl}/user/resetpassword`, { email, oldpassword, newpassword })
        .pipe(map(user => {
          let erroCollection = user.errorinfodvocollection;
          if (erroCollection.length > 0) {
            return user.errorinfodvocollection[0];
          } else {
            const userDetailsCollection = user.successMessage;
            return userDetailsCollection;
          }
        }));
    }

  }

  isLoggedInCheck() {
    if (JSON.parse(sessionStorage.getItem('user')!) == null) {
      this.isLoggedIn$.next(false)
      return false;
    } else {
      return true;
    }
  }

  logout() {
    this.isLoggedIn$.next(false)
    // remove user from local storage and set current user to null
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  sendVerificationEmail(payload: object) {
    const apiUrl = `${environment.apiUrl}/send-verification-email`;
    return this.http.post(apiUrl, payload);
  }

  forgotPasswordEmail(email: string) {
    const apiUrl = `${environment.apiUrl}/forgot-password-email`;
    const payload = { email };
    return this.http.post(apiUrl, payload);
  }

  getUser() {
    const email = this.userValue?.email;
    const dtacid = this.userValue?.serial_number;
    // return this.http.get<any>(`${environment.apiUrl}/getProfileDetails/${email}`);
    return this.http.post(`${environment.apiUrl}/getProfileDetails`, { email, dtacid });
  }

  updateUser(updatedUser: any) {
    const email = this.userValue?.email;
    const dtacid = this.userValue?.serial_number;
    this.user = { ...this.user, ...updatedUser };
    return this.http.post(`${environment.apiUrl}/setProfileData`, { updatedUser, email, dtacid });
  }

  getImageData() {
    const email = this.userValue?.email;
    return this.http.get(`${environment.apiUrl}/getImageData/${email}`);
  }

  register(formData: FormData): Observable<any> {
    // Replace the following URL with your backend registration endpoint
    return this.http.post(`${environment.apiUrl}//api/register`, formData);
  }

  getUserRegistrationPage(): Observable<any> {
    // Replace the following URL with your backend registration endpoint
    return this.http.get(`${environment.apiUrl}/getUserRegistrationPage`);
  }

  createAccount(formData: any) {
    return this.http.post(`${environment.apiUrl}/createAccount`, { formData });
  }

  retriveAccount(formData: FormData): Observable<any> {
    // Replace the following URL with your backend registration endpoint
    return this.http.post(`${environment.apiUrl}/retriveAccount` , formData);
  }
  setAccountDetails(accountDetails:any) {
    this.accountDetailsSubject.next(accountDetails)
  }
}
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
    isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false)
    
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
        if(!!this.userValue){
            const email = this.userValue.email;
            return this.http.post<Reset>(`${environment.apiUrl}/user/resetpassword`, {email, oldpassword, newpassword })
            .pipe(map(user => {
                let erroCollection = user.errorinfodvocollection;
                if (erroCollection.length > 0) {
                    return user.errorinfodvocollection[0];
                } else {
                    const userDetailsCollection = user.successMessage[0];
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
    sendVerificationEmail(email: string) {
        const apiUrl = `${environment.apiUrl}/send-verification-email`;
        const payload = { email };    
        return this.http.post(apiUrl, payload);
      }

      forgotPasswordEmail(email: string) {
        const apiUrl = `${environment.apiUrl}/forgot-password-email`;
        const payload = { email };    
        return this.http.post(apiUrl, payload);
      }

      getUser() {
        return sessionStorage.getItem('user');
      }
    
      updateUser(updatedUser: any) {
        this.user = { ...this.user, ...updatedUser };
      }

}
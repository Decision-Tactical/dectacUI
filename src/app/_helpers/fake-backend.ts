import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
const usersKey = 'angular-tutorial-users';
let users: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jsonUserDetails: any[] = [
            {
              "userid": "123450",
              "username": "john_doe0",
              "password": "secretpassword",
              "firstName": "John0",
              "lastName": "Doe0",
              "email": "johndoe@example.com",
              'userActive':'true'
            },
            {
              "userid": "123451",
              "username": "john_doe1",
              "password": "secretpassword",
              "firstName": "John1",
              "lastName": "Doe1",
              "email": "johndoe1@example.com",
              'userActive':'false'
            },
            {
              "userid": "123452",
              "username": "john_doe2",
              "password": "secretpassword",
              "firstName": "John2",
              "lastName": "Doe2",
              "email": "johndoe2@example.com",
              'userActive':'false'
            },
            {
              "userid": "123453",
              "username": "john_doe3",
              "password": "secretpassword",
              "firstName": "John3",
              "lastName": "Doe3",
              "email": "johndoe3@example.com",
              'userActive':'false'
            },
            {
              "userid": "123454",
              "username": "john_doe4",
              "password": "secretpassword",
              "firstName": "John4",
              "lastName": "Doe4",
              "email": "johndoe4@example.com",
              'userActive':'true'
            }
          ];
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/authenticate') && method === 'POST':
                    return authenticate();
                // case url.endsWith('/register') && method === 'POST':
                //     return register();
                case url.endsWith('/send-verification-email') && method === 'POST':
                    return authenticateEmail();
                    case url.endsWith('/forgot-password-email') && method === 'POST':
                    return forgotPasswordEmail();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: 'fake-jwt-token'
            })
        }

        function authenticateEmail() {
            const { email } = body;
            const user = jsonUserDetails.find((x: { email: any; }) => x.email === email);
            if (!user) {
                return error('Email Not Registered');
            } else if (user.userActive === 'true') {
                return error('Email Already Registered');
            } else {
                users.push(user);
                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            }
            
        }
         function forgotPasswordEmail(){
            const { email } = body;
            const user = jsonUserDetails.find((x: { email: any; }) => x.email === email);
            if (!user) {
                return error('Email Not Registered');
            } else if (user.userActive === 'false') {
                return error('You Are First Time User, Kindly Activate');
            } else {
                users.push(user);
                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            } 
         }
        // function register() {
        //     const user = body

        //     if (users.find(x => x.username === user.username)) {
        //         return error('Username "' + user.username + '" is already taken')
        //     }

        //     user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
        //     users.push(user);
        //     localStorage.setItem(usersKey, JSON.stringify(users));
        //     return ok();
        // }
        

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: string) {
            return throwError(() => ({ error: { message } }))
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function basicDetails(user: any) {
            const { userid, username, firstName, lastName, email } = user;
            return { userid, username, firstName, lastName, email };
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
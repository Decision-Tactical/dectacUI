import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AccountService } from './_services';
import "bootstrap";
import { Subscription } from 'rxjs/internal/Subscription';
import * as jQuery from 'jquery';
import { SpinnerService } from '@app/_services/spinner.service';
import { NavigationStart, Router } from '@angular/router';
export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // loading = true;
  isLoggedIn!: boolean;
  // reference to the isLoggedIn$ subscription, see ngOnDestroy
  private _sub!: Subscription;
  subscription!: Subscription;
  title = 'D-Tac';
  user: any;
  constructor(public accountService: AccountService, public spinnerService: SpinnerService, private router: Router) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    });
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.returnValue = true;
  }
  ngOnInit(): void {
    // setTimeout(() => {
    //   this.loading = false;
    // }, 2000);
    this._sub = this.accountService.isLoggedIn$.subscribe(loginState => this.isLoggedIn = loginState)
    this.user = this.accountService.userValue;
    let a: any = document.getElementById('dtacbody'); //document.querySelectorAll('.menu-item');
    a.addEventListener("click", function (event: any) {
      const x: any = document.getElementById('myLinks');
      if (event.target.id === 'mobile-menu-open' || event.target.farthestViewportElement && event.target.farthestViewportElement.id === 'mobile-menu-open') {
        x.classList.toggle('offset-menu--active');
      } else {
        if (x.classList.contains('offset-menu--active')) {
          x.classList.remove('offset-menu--active');
        }
      }
    });
    // window.addEventListener("load",function() {
    //   // Set a timeout...
    //   setTimeout(function(){
    //     // Hide the address bar!
    //     window.scrollTo(0, 1);
    //   }, 0);
    // });
  }
  // Unsubscribe from login state on destroy to prevent memory leak
  ngOnDestroy(): void {
    this._sub.unsubscribe();
    this.subscription.unsubscribe();
    this.accountService.logout();
  }

  logout() {
    this.accountService.logout();
  }

  myFunction(): void {
    let x: any = document.getElementById('myLinks');
    // jQuery('.right_content').removeClass('col-10').addClass('col-12');
    // jQuery('.left_content ').removeClass('col-2');
    x.classList.toggle('offset-menu--active');
  }

}

import { Component, OnInit } from '@angular/core';
// import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalComponent } from '../modal/modal.component';
import { AccountService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-right-navbar',
  templateUrl: './right-navbar.component.html',
  styleUrls: ['./right-navbar.component.css']
})
export class RightNavbarComponent implements OnInit{
  // modalRef: MdbModalRef<ModalComponent> | null = null;
  constructor(
    // private modalService: MdbModalService,
    private accountService: AccountService,
    private router: Router) {
  
  }
  ngOnInit(): void {
    // const a: any = document.getElementById('menu-mobile-menu'); //document.querySelectorAll('.menu-item');
    // a.addEventListener("click", function () {
    //   const x: any = document.getElementById('myLinks');
    //   x.classList.toggle('offset-menu--active');
    // });
  }

  // openModal() {
  //   this.modalRef = this.modalService.open(ModalComponent, {
  //     data: { title: 'Credit History' },
  //   });
  // }

  // resetPassword() {
  //   this.router.navigate(['/resetpassword'], { queryParams: { loginSuccess: true } });
  // }

  logout() {
    this.accountService.logout();
  }
  
  myFunction(): void {
    let x: any = document.getElementById('myLinks');
    x.classList.toggle('offset-menu--active');
  }

}

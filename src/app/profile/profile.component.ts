// src/app/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  userDetails:any;
  disName:boolean= true;

  constructor(private userService: AccountService) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.userDetails = JSON.parse(this.user);
    if(!!this.user) {
      console.log("this.user-->", this.user)
    }
  }

  updateProfile() {
    this.userService.updateUser(this.user);
    // You can also send the updated data to a server/API here if needed.
  }
}

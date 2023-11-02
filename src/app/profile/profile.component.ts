// src/app/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { UserDetails } from '@app/_models/userDetails';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  userDetails:UserDetails = {
    'address1': '',
    'address2': '',
    'city': '',
    'client_id': '',
    'country': '',
    'dob': '',
    'email': '',
    'first_name': '',
    'last_name': '',
    'middle_name': '',
    'profileimage': '',
    'racer_name': '',
    'serial_number': '',
    'state': '',
    'tel': '',
    'tel2': '',
    'zipcode': 0
  };
  disName:boolean= true;
  profileImage:any;

  constructor(private userService: AccountService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (data: any) => {
        this.userDetails = data.profiledetaildvocollection[0];
        if (this.userDetails.profileimage !== '') {
          this.profileImage = `${this.userDetails.profileimage}`;
        } else {
          this.profileImage = 'https://decisiontactical.com/wp-content/themes/dtac-theme/assets/img/vector/optimized/decision-tactical-logo-blue-black.svg';
        }
      },
      error: error => {
      }
    });
  }

  updateProfile() {
    this.userService.updateUser(this.user);
    // You can also send the updated data to a server/API here if needed.
  }
}

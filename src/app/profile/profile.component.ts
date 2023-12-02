import { Component, OnInit } from '@angular/core';
import { UserDetails } from '@app/_models/userDetails';
import { AccountService } from '@app/_services';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  userDetails: UserDetails = {
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
    'racer_name': '',
    'serial_number': '',
    'state': '',
    'tel': '',
    'tel2': '',
    'zipcode': 0
  };
  disName: boolean = true;
  disEnableButton: boolean = true;
  profileImage: any;
  initialAddress = {};

  constructor(private userService: AccountService) { }

  ngOnInit(): void {
    this.userService.getUser().pipe(
      switchMap((data: any) => {
        this.userDetails = data.profiledetaildvocollection[0];
        this.initialAddress = {
          'address1': this.userDetails.address1,
          'address2': this.userDetails.address2,
          'city': this.userDetails.city,
          'state': this.userDetails.state,
          'zipcode': this.userDetails.zipcode
        };
        return this.userService.getImageData();
      })
    ).subscribe((response: any) => {
      if (!!response) {
        // Get the base64-encoded image string from the JSON response
        const imageBase64 = response.image_base64;
        if (!!imageBase64) {
          // Decode the base64 image string
          this.profileImage = 'data:image/jpeg;base64,' + imageBase64.split(',')[1];
        } else {
          this.profileImage = 'https://decisiontactical.com/wp-content/themes/dtac-theme/assets/img/vector/optimized/decision-tactical-logo-blue-black.svg';
        }
      } else {
        this.profileImage = 'https://decisiontactical.com/wp-content/themes/dtac-theme/assets/img/vector/optimized/decision-tactical-logo-blue-black.svg';
      }

    });


    // this.userService.getUser().subscribe({
    //   next: (data: any) => {
    //     this.userDetails = data.profiledetaildvocollection[0];
    //     if ((!!this.userDetails.profileimage && this.userDetails.profileimage !== null)) {
    //       const reader = new FileReader();
    //       reader.onload = () => {
    //         this.profileImage = reader.result as string;
    //       };
    //       reader.readAsDataURL(this.userDetails.profileimage);
    //       // this.profileImage = `${this.userDetails.profileimage}`;
    //     } else {
    //       this.profileImage = 'https://decisiontactical.com/wp-content/themes/dtac-theme/assets/img/vector/optimized/decision-tactical-logo-blue-black.svg';
    //     }
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });
  }
  enableButton() {
    let currentAddress = {
      'address1': this.userDetails.address1,
      'address2': this.userDetails.address2,
      'city': this.userDetails.city,
      'state': this.userDetails.state,
      'zipcode': this.userDetails.zipcode
    };
    if (this.isDifferentAddress(this.initialAddress, currentAddress)) {
      this.disEnableButton = false;
    } else {
      this.disEnableButton = true;
    }

  }

  isDifferentAddress(addr1: any, addr2: any) {
    if ((addr1.address1 || '').trim().toUpperCase() !== (addr2.address1 || '').trim().toUpperCase() ||
      (addr1.address2 || '').trim().toUpperCase() !== (addr2.address2 || '').trim().toUpperCase() ||
      (addr1.city || '').trim().toUpperCase() !== (addr2.city || '').trim().toUpperCase() ||
      (addr1.state || '').trim().toUpperCase() !== (addr2.state || '').trim().toUpperCase() ||
      addr1.zipcode !== addr2.zipcode
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateProfile() {
    this.userService.updateUser(this.user);
    // You can also send the updated data to a server/API here if needed.
  }
}

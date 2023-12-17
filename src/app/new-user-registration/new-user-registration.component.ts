import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '@app/_models/userDetails';
import * as moment from 'moment';

@Component({
  selector: 'app-new-user-registration',
  templateUrl: './new-user-registration.component.html',
  styleUrls: ['./new-user-registration.component.css']
})
export class NewUserRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  selectedFile!: File;
  success?: string;
  error?: string;
  successHide?: boolean = true;
  profileImage: any;  
  minDate: any = moment('2020-1-1', 'YYYY-MM-DD').local();
  maxDate: any = moment().local();
  dateControl = new FormControl();
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
  dob: any;
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  endDateChanged(event: any) {
    this.dob = moment(event.value).local();
  }

  onSubmit() {
    // Handle registration logic here
    const formData = new FormData();
    formData.append('username', this.registrationForm.value.username);
    formData.append('email', this.registrationForm.value.email);
    formData.append('password', this.registrationForm.value.password);
    formData.append('profilePicture', this.selectedFile);

    // Replace the following URL with your backend endpoint for image upload
    this.http.post('/api/upload', formData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        // Handle success, e.g., navigate to another page
      },
      (error) => {
        console.error('Registration failed', error);
        // Handle error
      }
    );
  }

  onFileChange(event:any) {
    this.selectedFile = event.target.files[0];
  }
}

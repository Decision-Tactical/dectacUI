import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AccountService } from '../_services';
import { TermandconditionsComponent } from '../termandconditions/termandconditions.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ImageWebcamComponent } from '@app/image-webcam/image-webcam.component';
import { ImageUtilService } from '@app/_utils/image-util.service';


@Component({
  selector: 'app-new-user-registration',
  templateUrl: './new-user-registration.component.html',
  styleUrls: ['./new-user-registration.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewUserRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  registrationFormData!: {};
  formFields?: any[];
  previewImage: string | ArrayBuffer | null = null;
  success?: string;
  error?: string;
  successHide?: boolean = true;
  minDate: any = moment('1950-1-1', 'YYYY-MM-DD').local();
  maxDate: any = moment().local();
  maxDatelegal: any = moment().subtract(18, "years");profilePictureRequired: any;
;
  dob: any;
  isYesRadioSelected: boolean = false;
  config = {
    animation: true,
    backdrop: true,
    containerClass: 'right',
    data: {
      title: 'Signature Pad',
      firstName: '',
      lastName: '',
      birthDate: ''
    },
    ignoreBackdropClick: true,
    keyboard: true,
    modalClass: 'modal-dialog-scrollable',
    nonInvasive: false,
  };

  constructor(
    private modalService: MdbModalService,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private imageUtilService: ImageUtilService
  ) {
    this.registrationForm = this.formBuilder.group({
      address1: [''],
      address2: [''],
      birthDate: [''],
      city: [''],
      consentToEmail: [''],
      country: [''],
      militaryActiveBranch: [''],
      currentlyServingsFirstResponder: [''],
      email: [''],
      eventCode: [''],
      eventGroupIds: [''],
      firstName: [''],
      gender:[''],
      howDidYouHearAboutUs: [''],
      firstResponderActiveRank: [''],
      militaryActiveRank: [''],
      lastName: [''],
      firstResponderJobChoice: '',
      legalGardianFirstName: [''],
      legalGardianLastName: [''],
      legalGardianBirthDate: [''],
      milatoryJobChoice: '',
      mobilePhoneNumber: [''],
      othersHearAboutUs: [''],
      profilePicture: [''],
      referralCode: [''],
      racerName: [''],
      rulesAndRegulation: [''],
      firstResponderActiveYearsInTotal: [''],
      militaryActiveYears: [''],
      signPicture: [''],
      state: [''],
      validDoumentId: [''],
      validDoumentImage: [''],
      zipcode: ['']
    });
  }

  ngOnInit() {
    if (this.accountService.getUserRegistrationPage) {
      this.accountService.getUserRegistrationPage().subscribe(data => {
        if (data && data.pagelebelcollection) {
          this.formFields = data.pagelebelcollection[0];
          this.initializeForm();
        } else {
          console.error('Invalid API response structure.');
        }
      },
        error => {
          console.error('Error:', error);
        });
    }
  }

  initializeForm() {
    const formGroupConfig: any = {};
    this.formFields?.forEach(cardBody => {
      cardBody.cardBodyListCollection.forEach((field: {
        checked: boolean; inputType: string; buttonList: any[]; validators: any[]; controlName: string | number;
      }) => {
        const validatorsArray: any = [];
        if (field.validators) {
          field.validators.forEach((validator: any) => {
            if (validator === 'required' || validator === 'birthdate') {
              validatorsArray.push(Validators.required);
            } else {
              if (validator === 'email') {
                validatorsArray.push(Validators.email);
              }
            }
          });
        }
        if (field.inputType === 'radio') {
          // Find the default checked button for radio
          const defaultCheckedButton = field.buttonList.find(button => button.checked);
          // Set the default value for radio button
          formGroupConfig[field.controlName] = [defaultCheckedButton ? defaultCheckedButton.value : '', validatorsArray];
        } else {
          if (field.inputType === 'rulesandregulation' && field.checked === true) {
            // Set the default value for radio button
            formGroupConfig[field.controlName] = [true];
          } else {
            // For other input types
            formGroupConfig[field.controlName] = ['', validatorsArray];
          }

        }
      });
    });
    this.registrationForm = this.formBuilder.group(formGroupConfig);
  }

  get f() {
    return this.registrationForm.controls;
  }

  applyPromoCode() {
    console.log('its working--------->');
  }

  onSubmit() {
    if (this.registrationForm.valid && 
      this.registrationForm.value.rulesAndRegulation !== false &&
      !!this.registrationForm.value.profilePicture &&
      this.registrationForm.value.profilePicture !=='') {
      this.registrationFormData = { ...this.registrationFormData, ...this.registrationForm.value };
      this.accountService.createAccount(this.registrationFormData).subscribe({
        next: (data: any) => {
          // this.getUser();
          const element = document.getElementById('createNewAccountFormHeader');
          element?.scrollIntoView();
          this.success = data.accountdetaildvocollection[0].success;
          setTimeout(() => {
            this.success = '';
            this.error = '';
          }, 10000);
        },
        error: error => {
          this.error = error;
        }
      });

      setTimeout(() => {
        this.success = '';
        this.error = '';
      }, 10000);
    } else {
      const element = document.getElementById('createNewAccountFormHeader');
      element?.scrollIntoView();
      if(!this.registrationForm.value.profilePicture || this.registrationForm.value.profilePicture ==='') {
        this.profilePictureRequired = true;
      }
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  endDateChanged(event: any) {
    if (event.targetElement.id === 'birthDate') {
      this.dob = moment(event.value).local();
      const years = moment().diff(this.dob, 'years', false);
      const controlName = ['legalGardianFirstName', 'legalGardianLastName', 'legalGardianBirthDate'];
      const buttonitems = this.formFields?.find((item: { cardBodyType: String; }) => item.cardBodyType === 'personalDetails');
      if (years < 18) {
        buttonitems.cardBodyListCollection.forEach((value: { controlName: String; hide: boolean; }) => {
          controlName.forEach(item => {
            if (value.controlName === item) {
              value.hide = false;
            }
          })
        });
      } else {
        buttonitems.cardBodyListCollection.forEach((value: { controlName: String; hide: boolean; }) => {
          controlName.forEach(item => {
            if (value.controlName === item) {
              value.hide = true;
              const myControl = this.registrationForm.get(item);
              if (myControl) {
                myControl.reset();
              }
            }
          })
        });
      }
    }
  }

  populateCardBody(j: string, c: Array<String>) {
    if (c.length > 0) {
      const varFormFields = Object.assign([], this.formFields);;
      let buttonitems: any = varFormFields?.find((item: { cardBodyType: String; }) => item.cardBodyType === j);

      buttonitems.cardBodyListCollection.forEach((value: { controlName: String; hide: boolean; }) => {
        if (!(value.controlName === 'milatoryJobChoice' || value.controlName === 'firstResponderJobChoice')) {
          value.hide = true;
          const dynamicControlName: String = value.controlName;
          const myControl = this.registrationForm.get(dynamicControlName.toString());
          // Check if myControl is not null before calling reset
          if (myControl) {
            myControl.reset();
          }
        }
      });

      if ((buttonitems.cardBodyListCollection.length - 1) !== c.length) {
        buttonitems.cardBodyListCollection.forEach((value: { controlName: String; hide: boolean; }) => {
          c.forEach(item => {
            if (value.controlName === item) {
              value.hide = false;
            }
          })
        })
        this.isYesRadioSelected = true;
      } else {
        buttonitems.cardBodyListCollection.forEach((value: { controlName: String; hide: boolean; }) => {
          c.forEach(item => {
            if (value.controlName === item) {
              value.hide = true;
            }
          })
        });
        this.isYesRadioSelected = false;
      }
    }
  }

  radioChecked(id: any, i: any) {
    if (!!this.registrationForm.value) {
      let controlName: String[] = [];
      if (id === 'milatoryJobYes') {
        controlName = ['militaryActiveBranch', 'militaryActiveYears', 'militaryActiveRank', 'ifYes'];
        this.populateCardBody('milatoryJobDetails', controlName);
      }
      if (id === 'milatoryJobRetired') {
        controlName = ['militaryRetiredBranch', 'militaryRetiredYears', 'militaryRetiredRank', 'ifNo'];
        this.populateCardBody('milatoryJobDetails', controlName);
      }
      if (id === 'milatoryJobNo') {
        controlName = ['militaryActiveBranch', 'militaryActiveYears', 'militaryActiveRank', 'ifYes', 'militaryRetiredBranch', 'militaryRetiredYears', 'militaryRetiredRank', 'ifNo'];
        this.populateCardBody('milatoryJobDetails', controlName);
      }
      if (id === 'firstResponderActive') {
        controlName = ['firstResponderActiveBranch', 'firstResponderActiveYearsInTotal', 'firstResponderActiveRank', 'ifYes'];
        this.populateCardBody('firstResponderJobDetails', controlName);
      }
      if (id === 'firstResponderRetired') {
        controlName = ['firstResponderRetiredBranch', 'firstResponderRetiredYearsInTotal', 'firstResponderRetiredRank', 'ifNo'];
        this.populateCardBody('firstResponderJobDetails', controlName);
      }
      if (id === 'firstResponderNo') {
        controlName = ['firstResponderActiveBranch', 'firstResponderActiveYearsInTotal', 'firstResponderActiveRank', 'ifYes', 'firstResponderRetiredBranch', 'firstResponderRetiredYearsInTotal', 'firstResponderRetiredRank', 'ifNo', 'firstResponderActiveYearsInSwat', 'numberYearsPastSwatFirstResponder'];
        this.populateCardBody('firstResponderJobDetails', controlName);
      }
    }
  }

  populateDropdownItem(details: string, control: string, hidevalue: boolean) {
    let buttonitems = this.formFields?.find((item) => item.cardBodyType === details);
    let buttonitem = buttonitems.cardBodyListCollection.filter((e: { controlName: string; inputType: string }) => e.controlName === control)
    buttonitem.forEach((field: { controlName: String; hide: Boolean }) => {
      field.hide = hidevalue;
      if (hidevalue) {
        const dynamicControlName: String = field.controlName;
        const myControl = this.registrationForm.get(dynamicControlName.toString());
        // Check if myControl is not null before calling reset
        if (myControl) {
          myControl.reset();
        }
      }
    });
  }

  onOptionsSelected(value: string, event: any) {
    if (event.target.id === 'howDidYouHearAboutUs' && value === 'other') {
      this.populateDropdownItem('howDidYouHearAboutUsDetails', 'othersHearAboutUs', false);
    }

    if (event.target.id === 'howDidYouHearAboutUs' && value !== 'other') {
      this.populateDropdownItem('howDidYouHearAboutUsDetails', 'othersHearAboutUs', true);
    }

    if (event.target.id === 'firstResponderActiveBranch' && value !== 'lawEnforcementwithswatexperience') {
      this.populateDropdownItem('firstResponderJobDetails', 'firstResponderActiveYearsInSwat', true);
    }

    if (event.target.id === 'firstResponderActiveBranch' && value === 'lawEnforcementwithswatexperience') {
      this.populateDropdownItem('firstResponderJobDetails', 'firstResponderActiveYearsInSwat', false);
    }

    if (event.target.id === 'firstResponderRetiredBranch' && value === 'lawEnforcementwithswatexperience') {
      this.populateDropdownItem('firstResponderJobDetails', 'firstResponderRetiredYearsInSwat', false);
    }

    if (event.target.id === 'firstResponderRetiredBranch' && value !== 'lawEnforcementwithswatexperience') {
      this.populateDropdownItem('firstResponderJobDetails', 'firstResponderRetiredYearsInSwat', true)
    }
  }

  rulesAndRegulationCheck(value: any) {
    if ((value.target as HTMLInputElement).id === 'rulesAndRegulation' && (value.target as HTMLInputElement).checked) {
      this.config.data.firstName = this.registrationForm.value.firstName;
      this.config.data.lastName = this.registrationForm.value.lastName;
      this.config.data.birthDate = this.registrationForm.value.birthDate;
      const modalRefTermandconditions = this.modalService.open(TermandconditionsComponent, this.config);
      modalRefTermandconditions.component.formTermsAndConditionSubmitted.subscribe((signImage) => {
        if (!!signImage && signImage !== 'closed') {
          const dataToAppend = { ...this.registrationForm.value, ...{ 'signImage': signImage } };
          this.registrationFormData = { ...this.registrationFormData, ...dataToAppend };
        } else {
          if ((value.target as HTMLInputElement).id === 'rulesAndRegulation') {
            value.target.checked = false;
          }
        }
      });
      modalRefTermandconditions.onClose.subscribe((message: any) => {
        if (!message && message !== 'success') {
          if ((value.target as HTMLInputElement).id === 'rulesAndRegulation') {
            value.target.checked = false;
          }
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Display a preview of the selected image
      this.previewSelectedImage(file, (event.target as HTMLInputElement).id);
    }
  }
  addValidDoumentId(value: any) {
    const dataToAppend = { ...this.registrationForm.value, ...{ 'validDoumentId': (value.target as HTMLInputElement).value } };
    this.registrationFormData = { ...this.registrationFormData, ...dataToAppend };
  }

  previewSelectedImage(file: File, id: string): void {
    this.profilePictureRequired = false;
    const reader = new FileReader();
    let dataToAppend: {};
    reader.onload = () => {
      if (id !== 'validDoumentImage') {
        this.previewImage = reader.result;
        dataToAppend = { ...this.registrationForm.value, ...{ 'profilePicture': this.previewImage } };
      } else {
        dataToAppend = { ...this.registrationForm.value, ...{ 'validDoumentImage': reader.result } };
      }

      this.registrationFormData = { ...this.registrationFormData, ...dataToAppend };
    };
    reader.readAsDataURL(file);
  }
  triggerSnapshot(value: any) {
    const modalRefImageWevcam = this.modalService.open(ImageWebcamComponent, this.config);
    modalRefImageWevcam.component.imageWebcamSubmitted.subscribe((webcamImage) => {
      if (!!webcamImage && value.target.id !== 'fileImageWebcam') {
        const filename = 'webcam_image.png'; // You can set any filename
        const file = this.imageUtilService.dataURLtoFile(webcamImage.imageAsDataUrl, filename);
        this.previewSelectedImage(file, value.target.id);
      } else if (!!webcamImage && value.target.id === 'fileImageWebcam') {
        const dataToAppend = { ...this.registrationForm.value, ...{ 'validDoumentImage': webcamImage } };
        this.registrationFormData = { ...this.registrationFormData, ...dataToAppend };
      }
    });
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityFactoryService {

  constructor() { }
  createObject(): any {
    // You can customize the object creation logic here
    return {
      phone: '',
      email: '',
      dtacid:''
    };
  }
}



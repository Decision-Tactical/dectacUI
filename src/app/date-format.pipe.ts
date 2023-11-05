import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string, format: string): any {
    if (value) {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(value, format);
    }
    // Handle the case where value is null, e.g., return an empty string or another default value.
    return ''; // You can change this to your desired default value.
  }
}

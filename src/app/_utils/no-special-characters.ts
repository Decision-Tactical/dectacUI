import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpecialCharacters]'
})
export class NoSpecialCharactersDirective {

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const forbiddenKeys = /[^\w\s]/; // Regex pattern to allow only alphanumeric characters and spaces
    if (forbiddenKeys.test(event.key)) {
      event.preventDefault();
    }
  }

  constructor() { }

}

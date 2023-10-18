import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The requested page could not be found.</p>
      <!-- Add custom error message or UI here -->
    </div>
  `,
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {}

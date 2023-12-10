import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/_services';
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
export class NotFoundComponent implements OnInit{
  parsedData: any;

  constructor(private route: ActivatedRoute, private authService: AccountService, private router: Router) { }

 
  ngOnInit() {
    // Step 1: Parse data from URL
    this.route.params.subscribe(params => {
      this.parsedData = (this.router.url).replace("/", "") // Adjust 'yourParam' based on your actual parameter
    });

    // Step 2: Check authentication
    if (!this.authService.isLoggedInCheck()) {
      // Step 3: Redirect to login page with parsed data
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/', parsedData: this.parsedData } });
    } else {
      this.router.navigate(['/']);
    }
  }
}

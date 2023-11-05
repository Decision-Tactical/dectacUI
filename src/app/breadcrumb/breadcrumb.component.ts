import { Component, OnInit  } from '@angular/core';
import { BreadcrumbItem } from '@app/_models/breadcrumbItem';
import { filter, map } from "rxjs/operators";
import { Router, ActivatedRoute, Data, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  // @Input() breadcrumbs: BreadcrumbItem[] = [];
  items: BreadcrumbItem[] | undefined;
  home: BreadcrumbItem | undefined;
  currentRoute = '';
  constructor(private route: ActivatedRoute, private router: Router) {
    this.currentRoute = '';
    this.items = this._buildBreadcrumbs(this.route.root);
  }

  private _buildBreadcrumbs(
    activatedRoute: ActivatedRoute,
    url: string = ""
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = activatedRoute.children;
    if (children.length === 0) {
      return [];
    }

    let breadcrumbs: BreadcrumbItem[] = [];
    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join("/");
      if (routeURL !== "") {
        url += `/${routeURL}`;
      }

      const routeData: Data = child.snapshot.data;
      if (routeData.breadcrumb) {
        breadcrumbs.push({ label: routeData.breadcrumb, url: url });
      } else if (routeData.apiData && routeData.apiData.breadcrumb) {
        breadcrumbs.push({
          label: routeData.apiData.breadcrumb,
          url: url
        });
      }

      breadcrumbs = breadcrumbs.concat(this._buildBreadcrumbs(child, url));
    }

    return breadcrumbs;
  }

  ngOnInit() {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.items = this._buildBreadcrumbs(this.route.root);
    });
}
}




import { Component, OnInit, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DashboardService } from '@app/_services/dashboard.service';
import { switchMap } from 'rxjs/operators';
import { UserListData } from '@app/_models/userListData';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import * as e from 'cors';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  success?: string;
  error?: string;
  displayedColumns: any[] = [];
  columns: any[] = [];
  columnsToDisplay: any[] = [];
  data = new MatTableDataSource<UserListData>();
  generalFilter:string = '';
  toppings = new FormControl('');
  sortBySelected = new FormControl('');
  pickerFrom: any;
  pickerTo: any;
  minDate: any = moment('2020=1-1', 'YYYY-MM-DD').local();
  maxDate: any = moment().local();
  dateControl = new FormControl();
  selectedSortValue!: string; // To store the selected sort value
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor(
    private userlistService: DashboardService, private router: Router, private accountService: AccountService,) {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
  }
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSelect)
  select!: MatSelect;

  ngOnInit() {
    this.callAPIToGetData();
  }

  ngAfterViewInit() {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
  }
  onDateClick() {
    this.callAPIToGetData();
  }

  callAPIToGetData() {
    this.columns = [];
    this.data.data = [];
    // API call for json data
    const screeName = 'userlist';
    this.userlistService.getColumnData(screeName)
      .pipe(
        switchMap((data: any) => {
          if (data.tableColumnNameSetting.length > 0) {
            this.columns = data.tableColumnNameSetting[0];
            this.displayedColumns = this.columns.map(c => c.field);
            this.columnsToDisplay = this.displayedColumns.slice();
            if (!(this.pickerFrom && this.pickerTo)) {
              this.pickerTo = '';
              this.pickerFrom = '';
            }
            const dateobject = { 'toDate': this.pickerTo, 'fromDate': this.pickerFrom, 'generalFilter': this.generalFilter };
            return this.userlistService.getUserListTableData(dateobject);
          } else {
            return this.error = 'No Data Found';
          }
        })
      ).subscribe((response: any) => {
        if (response.errorinfodvocollection.length > 0) {
          if (!!response.errorinfodvocollection[0].error) {
            this.error = response.errorinfodvocollection[0].error;
          }
        }
        else {
          if (response.userdetailscollection.length > 0) {
            this.data = new MatTableDataSource<UserListData>(response.userdetailscollection[0]);
            this.data.paginator = this.paginator;
          } else {
            this.error = 'No Data Found';
          }
        }
        setTimeout(() => {
          this.success = '';
          this.error = '';
        }, 3000);
      });
  }

  updateColumn(data: any) {
    const selectedOptions = data.value;
    const notSelectedColumns = this.displayedColumns.filter(element => !selectedOptions.includes(element));
    if (selectedOptions.length > 0 && notSelectedColumns.length === 1 && notSelectedColumns[0] === 'selectall') {
      this.columnsToDisplay = [];
    } else if (selectedOptions.length === 0 && notSelectedColumns[0] === 'selectall') {
      this.columnsToDisplay = [...this.displayedColumns];
    } else if (selectedOptions.length === 1 && selectedOptions[0] === 'selectall') {
      this.columnsToDisplay = [...this.displayedColumns];
    } else {
      const filteredData = this.displayedColumns.filter(element =>
        selectedOptions.includes(element)
      );
      // Update MatTable with filtered data
      this.columnsToDisplay = filteredData;
    }
    // Filter or modify MatTable data based on selected options
    this.select.close();
  }
  selectAllCheckbox(topping: any) {
    this.columnsToDisplay = [...this.displayedColumns]; // Select all options
    // this.toppings.setValue(this.columnsToDisplay); // Update form control value
  }

  sortByColumn(sort: MatSort) {
    const data = this.data.data.slice(); // Get a copy of data
    let sortProperty = ''; // Variable to hold the sort property dynamically

    // Set the sort property based on the selected value
    if (typeof this.selectedSortValue === 'string') {
        sortProperty = this.selectedSortValue;
    }

    // Sort the data based on the dynamically specified property
    data.sort((a: any, b: any) => {
        // Ensure both objects have the property to compare
        if (a.hasOwnProperty(sortProperty) && b.hasOwnProperty(sortProperty)) {
            return a[sortProperty].localeCompare(b[sortProperty]);
        } else {
            return 0; // If the property is missing, consider them equal
        }
    });
    // const data = this.data.data.slice(); // Get a copy of data
    // if (typeof(this.selectedSortValue) === 'string') {
    //   data.sort((a: any, b: any) => a.sort.localeCompare(b.sort));
    // } 
    this.data.data = data;

    // const data = this.data.slice(); // Make a copy of the original data
    // if (!sort.active || sort.direction === '') {
    //   this.data = data;
    //   return;
    // }

    // this.data = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'name':
    //       return this.compare(a.name, b.name, isAsc);
    //     case 'quantity':
    //       return isAsc ? a.quantity - b.quantity : b.quantity - a.quantity;
    //     default:
    //       return 0;
    //   }
    // });
  }

  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // sortByColumn(event:any) {
  //   const selectedOptions = event.value;
  //   if (selectedOptions=== 'name') {
  //     // this.sortedItems = this.columnsToDisplay.slice().sort((a, b) => a.name.localeCompare(b.name));

  //     this.sortedItems = this.columnsToDisplay.slice().sort((a, b) => {
  //       if (a.name && b.name) {
  //         return a.name.localeCompare(b.name);
  //       }
  //       // Fallback to a basic string comparison if name is undefined for any item
  //       return (a.name || '').localeCompare(b.name || '');
  //     });
  //   } else if (selectedOptions=== 'weight') {
  //     this.sortedItems = this.columnsToDisplay.slice().sort((a, b) => a.weight - b.weight);
  //   }
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  }

  isSelected(element: any) {
    this.accountService.setUserDetails(element);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/getprofile'], { queryParams: { fetchAcount: true}})
    );  
    window.open(url);
    // this.router.navigate(['/getprofile'], { queryParams: { fetchAcount: true} });
  }

  startDateChanged(event: any) {
    this.pickerFrom = moment(event.value).local();
  }

  endDateChanged(event: any) {
    this.pickerTo = moment(event.value).local();
  }

  // shuffle() {
  //   let currentIndex = this.columnsToDisplay.length;
  //   while (0 !== currentIndex) {
  //     let randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex -= 1;

  //     // Swap
  //     let temp = this.columnsToDisplay[currentIndex];
  //     this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
  //     this.columnsToDisplay[randomIndex] = temp;
  //   }
  // }
}
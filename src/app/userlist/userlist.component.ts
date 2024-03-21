import { Component, OnInit, ViewChild } from '@angular/core';
import {NgFor} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { DashboardService } from '@app/_services/dashboard.service';
import { switchMap } from 'rxjs/operators';
import { UserListData  } from '@app/_models/userListData';
import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  success?: string;
  error?: string;
  displayedColumns:  any[] = [];
  columns:  any[] = [];
  columnsToDisplay:  any[] = [];
  data = new MatTableDataSource<UserListData >();
  toppings = new FormControl('');
  sortBySelected = new FormControl('');
  selectedSortValue!: string; // To store the selected sort value
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor(
    private userlistService: DashboardService) {
      this.data.sort = this.sort;
      this.data.paginator = this.paginator;
  }
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {  
    const screeName = 'userlist';
    this.userlistService.getColumnData(screeName)
      .pipe(
        switchMap((data: any) => {
          if (data.tableColumnNameSetting.length > 0) {
            this.columns = data.tableColumnNameSetting[0];
            this.displayedColumns = this.columns.map(c => c.field);
            this.columnsToDisplay = this.displayedColumns.slice();
            return this.userlistService.getUserListTableData();
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
            this.data = new MatTableDataSource<UserListData >(response.userdetailscollection[0]);
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

  ngAfterViewInit() {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
  }

  updateColumn(data: any) {
    const selectedOptions = data.value;
    // Filter or modify MatTable data based on selected options
    const filteredData = this.displayedColumns.filter(element =>
      selectedOptions.includes(element)
    );
    console.log(filteredData )
    // Update MatTable with filtered data
    this.columnsToDisplay = filteredData;
  }

  sortByColumn(sort: MatSort) {
    const data = this.data.data.slice(); // Get a copy of data
    if (this.selectedSortValue === 'firstName') {
      data.sort((a:any, b:any) => a.firstName.localeCompare(b.firstName));
    } else if (this.selectedSortValue === 'lastName') {
      data.sort((a:any, b:any) => a.lastName.localeCompare(b.lastName));
    } 
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

  isSelected(element:any){
    console.log('element-->', element);
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
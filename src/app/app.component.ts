import {AfterViewInit, OnInit, Component, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Product } from './shared/product.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-demo';
  displayedColumns: string[] = ['productName', 'category', 'price', 'date', 'gender', 'comment', 'action'];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private dialog: MatDialog, private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if(val === 'save') {
        this.getAllProducts()
      }
    });
  }

  getAllProducts() {
    console.log('aparna')
    this.apiService.getProduct().subscribe({
      next:(res) => {
        console.log(res, 'test');
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=> {
        alert("Error while fetching teh records");
      }
    })
  }

  editProduct(row: any) {
    console.log('edit')
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if(val === 'update') {
        this.getAllProducts()
      }
    })
  }

  deleteProduct(id:number) {
    this.apiService.deleteProduct(id).subscribe( {
      next: (res) => {
        alert('product deleted successfully')
        this.getAllProducts();  
      },
      error:(err)=> {
        alert("Error while deleting teh records");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
}

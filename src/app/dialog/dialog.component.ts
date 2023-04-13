import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  freshnessList = ["Brand New", "Second Hand"];
  actionBtn = 'Save';
  productForm : FormGroup; 

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
     private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      gender: ['', Validators.required],
      price: ['', Validators.required],
      comment: [''],
      date: ['', Validators.required],

    })
    console.log('tt', this.editData)
    if(this.editData) {
      this.actionBtn = 'Edit';
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['gender'].setValue(this.editData.gender);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct() {
    console.log(this.productForm.value);
   if(!this.editData) {
    if(this.productForm.valid) {
      this.apiService.postProduct(this.productForm.value).subscribe({
        next:(res) => {
          alert("product added successfully");
          this.productForm.reset();
          this.dialogRef.close('save');
        },
        error:()=> {
          alert('Error while adding a product');
        }
      });
    }
   } else {
    this.updateProduct();
   }
  }

  updateProduct() {
    this.apiService.putProduct(this.productForm.value, this.editData.id).subscribe({
      next:(res) => {
        alert("product updated successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=> {
        alert('Error while updating a product');
      }
    })
  }

}

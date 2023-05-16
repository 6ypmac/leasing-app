import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { CustomerService } from '../../api';
import { Customer } from '../../api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isEqual } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerUpdateService } from '../../services/customer-update.service'

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  title: string = 'Customer Details';
  customer: Customer;

  customerForm: FormGroup;
  initialFormValues: any = {};

  constructor(
    public dialogRef: MatDialogRef<CustomerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private customerUpdateService: CustomerUpdateService
  ) {
    console.log(this.data);
    this.title = this.data.title;
    this.customer = this.data.insideData;
    this.customerForm = this.createFormGroup();
    this.initialFormValues = this.customerForm.value;
  }

  ngOnInit(): void {
  }

  createFormGroup(): FormGroup {
    let date;

    if (!!this.customer.birthDate?.length) {
      const dateArray = this.customer.birthDate.split('-');
      const year = Number(dateArray[0]);
      const month = Number(dateArray[1]) - 1;
      const day = Number(dateArray[2]);
      date = new Date(year, month, day);
    } else {
      date = new Date();
    }

    return new FormGroup({
      firstName: new FormControl<string>(this.customer.firstName, [Validators.maxLength(50), Validators.required]),
      lastName: new FormControl<string>(this.customer.lastName, [Validators.maxLength(50), Validators.required]),
      birthDate: new FormControl(date, Validators.required)
    });
  }

  convertDate(date: Date): string {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  updateCustomer(): void {
    const customer = this.customerForm.value;
    const date = customer.birthDate;

    customer.birthDate = this.convertDate(date);

    this.customerUpdateService.triggerCustomerUpdate(this.customerForm.value);
  }

  openWarning(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  closeDialog(): void {
    this.customerForm.reset();
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.customerForm.valid) {
      if (!isEqual(this.initialFormValues, this.customerForm.value)) {
        this.updateCustomer();
        this.closeDialog();
      } else {
        this.openWarning('The form has not been edited. Make the necessary changes or use the Cancel button.', 'Close');
      }
    } else {
      console.log("Invalid form");
    }
  }

}

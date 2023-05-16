import { Component, Input, OnChanges, OnInit, SimpleChanges, Type } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractService, VehicleService, CustomerService } from '../../api';
import { Contract, Vehicle, Customer } from '../../api';
import { CardService } from '../../services/card.service';
import { Subscription, concatMap } from 'rxjs';
import { isEqual } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details.component';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component'
import { VehicleUpdateService } from '../../services/vehicle-update.service';
import { CustomerUpdateService } from '../../services/customer-update.service';

@Component({
  selector: 'app-leasing-contract',
  templateUrl: './leasing-contract.component.html',
  styleUrls: ['./leasing-contract.component.scss']
})
export class LeasingContractComponent implements OnInit{

  @Input() contractId: number = 0;

  customerId: number | undefined;
  vehicleId: number | undefined;

  isCreate: boolean = true;
  initialFormValues: any = {};
  currentYear = new Date().getFullYear();

  cardTitle: string = 'Leasing Contract';

  subscriptions: Subscription[] = [];

  contractInitial: Contract = {
    id: undefined,
    monthlyRate: 0,
    vehicle: {
      brand: '',
      model: '',
      modelYear: this.currentYear,
      price: 0
    },
    customer: {
      firstName: '',
      lastName: '',
      birthDate: ''
    },
  };

  contract: Contract = this.contractInitial;

  contractForm: FormGroup = new FormGroup({
    contractNo: new FormControl<number | undefined>({value: undefined, disabled: true}, Validators.required),
    monthlyRate: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    vehicle: new FormControl<string>('', [Validators.required]),
    customer: new FormControl<string>('', [Validators.required])
  });

  constructor(
    private cardService: CardService,
    private contractService: ContractService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private vehicleUpdateService: VehicleUpdateService,
    private customerUpdateService: CustomerUpdateService
  ) {
    this.vehicleUpdateService.vehicleUpdate$.subscribe((responseData: any) => {
      this.fillVehicleControl(responseData, true);
      this.contract.vehicle = responseData;
    });
    this.customerUpdateService.customerUpdate$.subscribe((responseData: any) => {
      this.fillCustomerControl(responseData, true);
      this.contract.customer = responseData;
    });
  }

  ngOnInit(): void {
    this.isCreate = !this.contractId;

    if (this.isCreate) {
      this.fillForm(this.contractInitial);
    } else {
      this.fetchContract(this.contractId);
    }
  }

  fetchContract(id: number): void {
    this.contractService.getContractForId(id).subscribe((contract: Contract) => {
      this.contract = contract;
      this.customerId = contract.customer.id;
      this.vehicleId = contract.vehicle.id;

      const dateArray = this.contract.customer.birthDate;
      this.contract.customer.birthDate = dateArray[0] +
        '-' + String(dateArray[1]).padStart(2, '0') +
        '-' + String(dateArray[2]).padStart(2, '0');

      this.fillForm(this.contract);
    });
  }

  fillForm(contract: Contract): void {
    this.fillCustomerControl(contract.customer, !!contract.id);
    this.fillVehicleControl(contract.vehicle, !!contract.id);
    this.contractForm.get('contractNo')?.setValue(contract.id);
    this.contractForm.get('monthlyRate')?.setValue(contract.monthlyRate);

    this.initialFormValues = this.contractForm.value;
  }

  fillCustomerControl(customer: Customer, shouldBeFilled?: boolean): void {
    let contractCustomer = '';

    if (shouldBeFilled) {
      contractCustomer = (
        customer.firstName + ' '
        + customer.lastName
      ).trim();
    }

    this.contractForm.get('customer')?.setValue(contractCustomer);
  }

  fillVehicleControl(vehicle: Vehicle, shouldBeFilled?: boolean): void {
    let contractVehicle = '';

    if (shouldBeFilled) {
      contractVehicle = (
        vehicle.brand
        + ' ' + vehicle.model
        + ' (' + vehicle.modelYear + ') '
        + 'VIN: ' + (!vehicle.vin?.trim().length ? '-' : vehicle.vin)
      ).trim();
    }

    this.contractForm.get('vehicle')?.setValue(contractVehicle);
  }

  createContract(contract: Contract): void {
    this.customerService.createCustomer(contract.customer).pipe(
      concatMap(customerResponse => {
        contract.customer.id = customerResponse.id;
        return this.vehicleService.createVehicle(contract.vehicle);
      }),
      concatMap(vehicleResponse => {
        contract.vehicle.id = vehicleResponse.id;
        return this.contractService.createContract(contract);
      }),
    ).subscribe({
      next: () => {
        this.cardService.triggerContractUpdate();
        this.resetForm();
      },
      error: error => {
        console.error(error);
      }
    });
  }

  updateContractById(contract: Contract): void {
    this.contractService.updateContract(this.contractId, contract).subscribe({
      next: () => {
        this.cardService.triggerContractUpdate();
        this.resetForm();
      },
      error: error => {
        console.error(error);
      }
    });
  }

  openWarning(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  openDialog(insideComponent: Type<any>, title: string, insideData: any): void {
    this.dialog.open(insideComponent, {
      width: '500px',
      data: { insideData, title }
    });
  }

  openVehicle(vehicle: Vehicle): void {
    const title: string = 'Vehicle Details';
    this.openDialog(VehicleDetailsComponent, title, vehicle);
  }

  updateVehicle(): void {
    if (!this.contract.vehicle.id) {
      this.contract.vehicle.id = this.vehicleId;
    }
    this.openVehicle(this.contract.vehicle);
  }

  deleteVehicle(): void {
    this.openVehicle(this.contractInitial.vehicle)
  }

  openCustomer(customer: Customer): void {
    const title: string = 'Customer Details';
    this.openDialog(CustomerDetailsComponent, title, customer);
  }

  updateCustomer(): void {
    this.openCustomer(this.contract.customer);
  }

  deleteCustomer(): void {
    this.openCustomer(this.contractInitial.customer);
  }

  saveContract(): void {
    if (!this.contract.vehicle.vin?.trim()) {
      delete this.contract.vehicle.vin;
    };

    this.contract.monthlyRate = this.contractForm.value.monthlyRate;

    if (this.isCreate) {
      delete this.contract.id;
      delete this.contract.customer.id;
      delete this.contract.vehicle.id;

      this.createContract(this.contract);
    } else {
      this.contract.customer.id = this.customerId;
      this.contract.vehicle.id = this.vehicleId;

      this.updateContractById(this.contract);
    }
  }

  resetForm(): void {
    this.contractForm.reset();
    this.cardService.close();
  }

  onSubmit() {
    if (this.contractForm.valid) {
      if (!isEqual(this.initialFormValues, this.contractForm.value)) {
        this.saveContract();
      } else {
        this.openWarning('The form has not been edited. Make the necessary changes or use the Cancel button.', 'Close');
      }
    } else {
      console.log("Invalid form");
    }
  }

}

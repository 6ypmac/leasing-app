import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../api';
import { Contract, Vehicle, Customer } from '../../api';
import { CardService } from '../../services/card.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leasing-contract2',
  template: `<div>Test</div>`
})
export class LeasingContractComponent implements OnChanges {

  @Input() contractId: number = 0;
  @Input() contractsId: (number | undefined)[] = [];

  isCreate: boolean = true;
  isFormNotChanged: boolean = true;
  initialFormValues: any = {};

  cardTitle: string = 'Leasing Contract';

  subscriptions: Subscription[] = [];

  emptyContract: Contract = {
    id: undefined,
    monthlyRate: 0,
    vehicle: {} as Vehicle,
    customer: {} as Customer,
  };

  contract: Contract;
  contractCustomer: string = '';
  contractVehicle: string = '';

  contractForm: FormGroup;

  constructor(
    public cardService: CardService,
    public contractService: ContractService
  ) {
    this.contract = this.emptyContract;

    this.contractForm = new FormGroup({
      contractNo: new FormControl<number | undefined>(undefined, [Validators.required]),
      monthlyRate: new FormControl<number>(0, [Validators.required]),
      vehicle: new FormControl<string>('', [Validators.required]),
      customer: new FormControl<string>('', [Validators.required])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['contractId']) {
      this.isCreate = !changes['contractId'].currentValue;

      if (!this.isCreate) {
        this.fetchContract(changes['contractId'].currentValue);
      } else {
        this.contract = this.emptyContract;
        this.contractCustomer = '';
        this.contractVehicle = '';
      }
    }

    this.initialFormValues = this.contractForm.value;

    const contractNoControl = this.contractForm.get('contractNo');
    if (contractNoControl) {
      const subscription = contractNoControl.valueChanges.subscribe(value => {
        console.log('initial: ' + JSON.stringify(this.initialFormValues.contractNo, null, 4));
        console.log('current: ' + JSON.stringify(this.contractForm.value.contractNo, null, 4));
        this.isFormNotChanged = (this.contractForm.value.contractNo === this.initialFormValues.contractNo);
      });
      this.subscriptions.push(subscription);
    }

    const monthlyRateControl = this.contractForm.get('monthlyRate');
    if (monthlyRateControl) {
      const subscription = monthlyRateControl.valueChanges.subscribe(value => {
        this.isFormNotChanged = (this.contractForm.value === this.initialFormValues);
      });
      this.subscriptions.push(subscription);
    }

    const customerControl = this.contractForm.get('customer');
    if (customerControl) {
      const subscription = customerControl.valueChanges.subscribe(value => {
        this.isFormNotChanged = (this.contractForm.value === this.initialFormValues);
      });
      this.subscriptions.push(subscription);
    }

    const vehicleControl = this.contractForm.get('vehicle');
    if (vehicleControl) {
      const subscription = vehicleControl.valueChanges.subscribe(value => {
        this.isFormNotChanged = (this.contractForm.value === this.initialFormValues);
      });
      this.subscriptions.push(subscription);
    }
  }

  fetchContract(id: number): void {
    this.contractService.getContractForId(id).subscribe((contract: Contract) => {
      this.contract = contract;
      this.contractCustomer = (contract.customer.firstName + ' ' + contract.customer.lastName).trim();
      this.contractVehicle = (
        contract.vehicle.brand
        + ' ' + contract.vehicle.model
        + ' (' + contract.vehicle.modelYear + ') '
        + 'VIN: ' + (!contract.vehicle.vin?.length ? '-' : contract.vehicle.vin)
      ).trim();
    });
  }

  resetForm(): void {
    this.contractForm.reset();
    this.cardService.close();
  }

  onSubmit() {
    if (this.contractForm.valid) {
      console.log(this.contractForm.value);
    } else {
      console.log("Invalid form");
    }
  }

}

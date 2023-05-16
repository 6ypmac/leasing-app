import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelAndBrandService } from '../../api';
import { Vehicle, Model, Brand } from '../../api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isEqual } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleUpdateService } from '../../services/vehicle-update.service'

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {

  title: string;
  vehicle: Vehicle;
  currentYear = new Date().getFullYear();

  brands: Brand[] = [];
  models: Model[] = [];

  brandId: number | undefined;

  vehicleForm: FormGroup;
  initialFormValues: any = {};

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modelAndBrandService: ModelAndBrandService,
    private _snackBar: MatSnackBar,
    private vehicleUpdateService: VehicleUpdateService
  ) {
    this.title = this.data.title;
    this.vehicle = this.data.insideData;
    this.vehicleForm = this.createFormGroup();
    this.initialFormValues = this.vehicleForm.value;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    if (!!this.vehicle.brand) {
      this.modelAndBrandService.getBrands().subscribe(brands => {
        this.brands = brands;
        this.brandId = this.getIdByName(this.vehicle.brand, this.brands);
        this.getModels();
        this.subscribeToBrandChanges();
      });
    } else {
      this.modelAndBrandService.getBrands().subscribe(brands => {
        this.brands = brands;
        this.subscribeToBrandChanges();
      });
    }
  }

  subscribeToBrandChanges(): void {
    this.vehicleForm.get('brand')?.valueChanges.subscribe(brandName => {
      this.brandId = this.getIdByName(brandName, this.brands);
      this.getModels();
      this.vehicleForm.get('model')?.setValue(undefined);
    });
  }

  getModels(): void {
    if (this.brandId) {
      this.modelAndBrandService.getModelsByBrandId(this.brandId).subscribe(models => {
        this.models = models;
      });
    } else {
      this.models = [];
    }
  }

  getIdByName(name: string, array: any[]): number | undefined {
    for (let item of array) {
      if (item.name === name) {
        return item.id;
      }
    }
    return undefined;
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      brand: new FormControl<string>(this.vehicle.brand, Validators.required),
      model: new FormControl<string>(this.vehicle.model, Validators.required),
      modelYear: new FormControl<number>(this.vehicle.modelYear, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1885),
        Validators.max(this.currentYear)
      ]),
      vin: new FormControl<string|undefined>(this.vehicle.vin, [Validators.minLength(0), Validators.maxLength(17)]),
      price: new FormControl<number>(this.vehicle.price, [Validators.required, Validators.min(0)])
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

  closeDialog(): void {
    this.vehicleForm.reset();
    this.dialogRef.close();
  }

  updateVehicle(): void {
    this.vehicleUpdateService.triggerVehicleUpdate(this.vehicleForm.value);
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      if (!isEqual(this.initialFormValues, this.vehicleForm.value)) {
        this.updateVehicle();
        this.closeDialog();
      } else {
        this.openWarning('The form has not been edited. Make the necessary changes or use the Cancel button.', 'Close');
      }
    } else {
      console.log("Invalid form");
    }
  }
}

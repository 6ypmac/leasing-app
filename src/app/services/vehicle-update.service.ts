import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleUpdateService {

  private vehicleUpdateSource = new Subject<any>();
  vehicleUpdate$ = this.vehicleUpdateSource.asObservable();

  triggerVehicleUpdate(responseData: any): void {
    this.vehicleUpdateSource.next(responseData);
  }
}

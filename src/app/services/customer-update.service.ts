import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerUpdateService {

  private customerUpdateSource = new Subject<any>();
  customerUpdate$ = this.customerUpdateSource.asObservable();

  triggerCustomerUpdate(responseData: any): void {
    this.customerUpdateSource.next(responseData);
  }
}

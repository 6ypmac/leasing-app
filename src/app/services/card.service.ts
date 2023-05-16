import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private contractUpdateSource = new Subject<void>();
  contractUpdate$ = this.contractUpdateSource.asObservable();

  triggerContractUpdate(): void {
    this.contractUpdateSource.next();
  }

  isCardVisible$ = new BehaviorSubject<boolean>(false);

  open() {
    this.isCardVisible$.next(true);
  }

  close() {
    this.isCardVisible$.next(false);
  }
}

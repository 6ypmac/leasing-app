import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  isModalVisible$ = new BehaviorSubject<boolean>(false)

  open() {
    this.isModalVisible$.next(true);
  }

  close() {
    this.isModalVisible$.next(false);
  }
}

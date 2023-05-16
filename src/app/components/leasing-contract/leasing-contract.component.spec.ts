import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog'; // import this
import { MatSnackBar } from '@angular/material/snack-bar';

import { LeasingContractComponent } from './leasing-contract.component';

describe('LeasingContractComponent', () => {
  let component: LeasingContractComponent;
  let fixture: ComponentFixture<LeasingContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeasingContractComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: MatSnackBar, useValue: { open: () => {} } },
        { provide: MatDialog, useValue: { open: () => {} } } // mock MatDialog
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeasingContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VehicleDetailsComponent } from './vehicle-details.component';

describe('VehicleComponent', () => {
  let component: VehicleDetailsComponent;
  let fixture: ComponentFixture<VehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {
            title: 'Vehicle Details',
            insideData: {
              id: 1,
              brand: 'BMW',
              model: 'X5',
              modelYear: '2023',
              price: 30000
            }
          }
        },
        { provide: MatSnackBar, useValue: { open: () => {} } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

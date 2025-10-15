import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailCommercial } from './customer-detail-commercial';

describe('CustomerDetailCommercial', () => {
  let component: CustomerDetailCommercial;
  let fixture: ComponentFixture<CustomerDetailCommercial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailCommercial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailCommercial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

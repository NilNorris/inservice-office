import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailPricing } from './customer-detail-pricing';

describe('CustomerDetailPricing', () => {
  let component: CustomerDetailPricing;
  let fixture: ComponentFixture<CustomerDetailPricing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailPricing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailPricing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailLocalization } from './customer-detail-localization';

describe('CustomerDetailLocalization', () => {
  let component: CustomerDetailLocalization;
  let fixture: ComponentFixture<CustomerDetailLocalization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailLocalization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailLocalization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

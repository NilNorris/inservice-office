import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailRegistration } from './customer-detail-registration';

describe('CustomerDetailRegistration', () => {
  let component: CustomerDetailRegistration;
  let fixture: ComponentFixture<CustomerDetailRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

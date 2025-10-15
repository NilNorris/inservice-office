import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailContact } from './customer-detail-contact';

describe('CustomerDetailContact', () => {
  let component: CustomerDetailContact;
  let fixture: ComponentFixture<CustomerDetailContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailExtra } from './customer-detail-extra';

describe('CustomerDetailExtra', () => {
  let component: CustomerDetailExtra;
  let fixture: ComponentFixture<CustomerDetailExtra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailExtra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailExtra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailPortfolio } from './customer-detail-portfolio';

describe('CustomerDetailPortfolio', () => {
  let component: CustomerDetailPortfolio;
  let fixture: ComponentFixture<CustomerDetailPortfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailPortfolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailPortfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

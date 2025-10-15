import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailAgenda } from './customer-detail-agenda';

describe('CustomerDetailAgenda', () => {
  let component: CustomerDetailAgenda;
  let fixture: ComponentFixture<CustomerDetailAgenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailAgenda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailAgenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

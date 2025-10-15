import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailStat } from './customer-detail-stat';

describe('CustomerDetailStat', () => {
  let component: CustomerDetailStat;
  let fixture: ComponentFixture<CustomerDetailStat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailStat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailStat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

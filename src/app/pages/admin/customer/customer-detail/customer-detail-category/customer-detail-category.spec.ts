import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailCategory } from './customer-detail-category';

describe('CustomerDetailCategory', () => {
  let component: CustomerDetailCategory;
  let fixture: ComponentFixture<CustomerDetailCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

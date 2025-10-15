import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipForm } from './tip-form';

describe('TipForm', () => {
  let component: TipForm;
  let fixture: ComponentFixture<TipForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

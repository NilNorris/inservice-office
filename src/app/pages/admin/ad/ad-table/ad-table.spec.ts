import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdTable } from './ad-table';

describe('AdTable', () => {
  let component: AdTable;
  let fixture: ComponentFixture<AdTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

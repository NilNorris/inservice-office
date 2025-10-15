import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipList } from './tip-list';

describe('TipList', () => {
  let component: TipList;
  let fixture: ComponentFixture<TipList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

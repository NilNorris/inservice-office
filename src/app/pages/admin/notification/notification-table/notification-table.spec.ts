import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTable } from './notification-table';

describe('NotificationTable', () => {
  let component: NotificationTable;
  let fixture: ComponentFixture<NotificationTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

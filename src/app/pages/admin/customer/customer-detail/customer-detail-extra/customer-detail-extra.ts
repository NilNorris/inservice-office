import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-customer-detail-extra',
  imports: [],
  templateUrl: './customer-detail-extra.html',
  styleUrl: './customer-detail-extra.scss'
})
export class CustomerDetailExtra {
  @Input() customer:any;
}

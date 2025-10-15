import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-customer-detail-pricing',
  imports: [InputTextModule,TextareaModule],
  templateUrl: './customer-detail-pricing.html',
  styleUrl: './customer-detail-pricing.scss'
})
export class CustomerDetailPricing {
   @Input() customer:any;
}

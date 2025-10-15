import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: 'app-customer-detail-commercial',
  imports: [InputTextModule, TextareaModule, ProgressSpinnerModule],
  templateUrl: './customer-detail-commercial.html',
  styleUrl: './customer-detail-commercial.scss'
})
export class CustomerDetailCommercial {
  @Input() customer:any;
}

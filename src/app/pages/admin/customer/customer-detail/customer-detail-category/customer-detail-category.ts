import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: 'app-customer-detail-category',
  imports: [MultiSelectModule, FormsModule],
  templateUrl: './customer-detail-category.html',
  styleUrl: './customer-detail-category.scss'
})
export class CustomerDetailCategory {
  multiselectCountries: any[] = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' }
  ];
   multiselectSelectedCountries!: any[];
}

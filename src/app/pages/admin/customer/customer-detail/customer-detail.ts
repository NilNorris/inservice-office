import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CustomerDetailCommercial } from "./customer-detail-commercial/customer-detail-commercial";
import { CustomerDetailCategory } from "./customer-detail-category/customer-detail-category";
import { CustomerDetailPricing } from "./customer-detail-pricing/customer-detail-pricing";
import { CustomerDetailContact } from "./customer-detail-contact/customer-detail-contact";
import { CustomerDetailExtra } from "./customer-detail-extra/customer-detail-extra";
import { CustomerDetailPortfolio } from "./customer-detail-portfolio/customer-detail-portfolio";
import { CustomerDetailLocalization } from "./customer-detail-localization/customer-detail-localization";
import { CustomerDetailAgenda } from "./customer-detail-agenda/customer-detail-agenda";
import { CustomerDetailRegistration } from "./customer-detail-registration/customer-detail-registration";
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@/services/customer/customer-service';
import { ToastrService } from 'ngx-toastr';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { finalize } from 'rxjs';


@Component({
  selector: 'app-customer-detail',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule,
    CustomerDetailCommercial,
    CustomerDetailCategory,
    CustomerDetailPricing,
    CustomerDetailContact,
    CustomerDetailExtra,
    CustomerDetailPortfolio,
    CustomerDetailLocalization,
    CustomerDetailAgenda,
    CustomerDetailRegistration,
    ProgressSpinnerModule
],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',

})
export class CustomerDetail {

    customer:any|null = null;
    loading:boolean = true;

  constructor (private activatedRoute:ActivatedRoute,  private customerService:CustomerService, private toastrService:ToastrService, private router:Router) {};

      ngAfterViewInit(): void {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams['_id']) {
            this.customerService.getProfil()
           .pipe(
                finalize(() => { 
                    this.loading = false;
                })
            )
            .subscribe(
                {
                    error:(e:any)=>{
                        this.toastrService.error('Une erreur s\'est produite');
                         this.router.navigate(['/admin/customer']);
                    },
                    next:(response:any) => {
                        this.customer = response;
                    }
                }
            );
        } else {
           this.toastrService.error('Profil non trouvé');
            this.router.navigate(['/admin/customer']);
        } 
    }
}

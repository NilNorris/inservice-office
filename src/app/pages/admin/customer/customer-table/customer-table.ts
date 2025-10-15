import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table, TableModule } from "primeng/table";
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CustomerService } from '@/services/customer/customer-service';
import { finalize } from 'rxjs/operators';
import { TagModule } from "primeng/tag";
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Popover, PopoverModule } from "primeng/popover";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { CategoryService } from '@/services/category/category-service';
import { EntityService } from '@/services/entity/entity-service';
import { SortIcon } from '@/components/sort-icon/sort-icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-table',
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    ProgressSpinnerModule,
    PopoverModule,
    InputGroupModule,
    InputGroupAddonModule,
    SortIcon,
],
  templateUrl: './customer-table.html',
  styleUrl: './customer-table.scss'
})
export class CustomerTable {
  customers: any[] = [];
  categories:any = [];
    entities:any[] = [];

    loading: boolean = true;
    loadingShowMore:boolean = false;
    count:number = 0;

    defaultFilter:Object =  {code:'ALL', name:'Tous'};
    searchFilter:any = "";
    categoryFilter:any = this.defaultFilter;
    statusFilter:any =this.defaultFilter;
    entityFilter:any = this.defaultFilter;

    sortKey:string = "";
    sortDir:string = "DESC";

    defaultCustomers:any[] = [];
    defaultCount:number = 0;

    status = [
       this.defaultFilter,
        {code:'ACTIVE', name:'Actif'},
        {code:'INACTIVE', name:'Inactif'},
    ]

  @ViewChild('filter') filter!: ElementRef;

  constructor(private customerService: CustomerService, private categoryService:CategoryService, private entityService:EntityService, private router:Router) {}

    ngOnInit() {
      this.customerService.getCustomer(0)
      .pipe(
          finalize(() => { 
            this.loading = false;
          })
      )
      .subscribe(
          {
              error:(e:any)=>{
                  
              },
              next:(response:any) => {
                  this.customers = this.defaultCustomers = response.data;
                  this.count = this.defaultCount = response.count;
              }
          }
      );

      this.categoryService.getCategoryCount().subscribe(
            {
                error:(e:any)=>{
                    
                },
                next:(response:any) => {
                    this.categories = response ? response.map((category:any) => (
                        {
                            name: category.label,
                            code: category.slug
                        }
                    )) : [];
                    this.categories.unshift(this.defaultFilter);
                }
            }
        );

        this.entityService.getEntity().subscribe(
            {
                error:(e:any)=>{
                   
                },
                next:(response:any) => {
                    this.entities = response.map((entity:any) => (
                        {
                            name: entity.label,
                            code: entity.slug
                        }
                    ));
                    this.entities.unshift(this.defaultFilter);
                }
            }
        );

    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }

    getAddress(customer:any) {
        if (customer.localisation.length > 0) {
            return customer.localisation[0].city+", "+customer.localisation[0].address;;
        } else {
            return "Non renseigné";
        }
    }

    showMore() {
        this.loadingShowMore=true;
        let offset = this.customers.length;
        let filters:any = {
            category : this.categoryFilter?.code ,
            entity : this.entityFilter?.code,
            search : this.searchFilter,
            status : this.statusFilter?.code, 
        }
        if (this.sortKey) {
            filters['sortKey'] = this.sortKey;
            filters['sortDir'] = this.sortDir;
        } 
        this.customerService.getCustomer(offset, filters).subscribe(
            {
                error:(e:any)=>{
                   
                },
                next:(response:any) => {
                    this.loadingShowMore=false;
                    this.customers = this.defaultCustomers = [...this.customers,...response.data];
                    this.count = this.defaultCount = response.count;
                }
            }
        );
    }

    toggleFilterPopOver(op: Popover, event: any) {
        op.toggle(event);
    }

    applyFilter(sort:boolean = false) {
        let filters:any = {
            category : this.categoryFilter?.code ,
            entity : this.entityFilter?.code,
            search : this.searchFilter,
            status : this.statusFilter?.code, 
        }
        if (sort) {
            filters['sortKey'] = this.sortKey;
            filters['sortDir'] = this.sortDir;
        } else {
            this.sortKey = "";
        }
        this.customerService.getCustomer(0, filters)
        .pipe(
            finalize(() => { 
                this.loading = false;
            })
        )        
        .subscribe(
            {
                error:(e:any)=>{
                   
                },
                next:(response:any) => {                   
                    if (!response) {
                        this.customers = [];
                        this.count =0;
                    } else {
                       this.customers = response.data;
                        this.count = response.count;
                    }                    
                }
            }
        );
    }

    isFilterCancelable() {
        return this.categoryFilter.code === 'ALL' && this.entityFilter.code === 'ALL' && this.statusFilter.code === 'ALL';
    }

    resetFilter() {
        this.searchFilter = this.defaultFilter;
        this.entityFilter = this.defaultFilter;
        this.statusFilter = this.defaultFilter;
        this.searchFilter = "";
        this.customers = this.defaultCustomers;
        this.count = this.defaultCount;
    }

    sortBy(key:string) {
        this.sortKey = key;
        this.sortDir = this.sortDir === 'DESC' ? 'ASC' : 'DESC';
        this.applyFilter(true);
    }

    viewDetail(_id:string) {
        this.router.navigate(['/admin/customer/detail'], {queryParams:{_id:_id}});
    }
  }

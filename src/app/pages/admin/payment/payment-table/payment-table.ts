import { PaymentService } from '@/services/payment/payment-service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { finalize } from 'rxjs';
import { AppService } from 'src/app-service';
import { SortIcon } from '@/components/sort-icon/sort-icon';
import { SelectModule } from 'primeng/select';
import { Enum } from '../../../../enum/enum';
import { TextareaModule } from 'primeng/textarea';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-table',
  imports: [
    TableModule,
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
	RippleModule,
	IconFieldModule,
	ProgressSpinnerModule,
	PopoverModule,
	InputGroupModule,
	InputGroupAddonModule,
	DialogModule,
	FieldsetModule,
    SortIcon,
    SelectModule,
    TextareaModule
  ],
  templateUrl: './payment-table.html',
  styleUrl: './payment-table.scss'
})
export class PaymentTable {
    payments: any[] = [];

    loading: boolean = true;
    loadingShowMore:boolean = false;
    loadingAction:boolean = false;
    count:number = 0;

    defaultFilter:Object =  {code:'ALL', name:'Tous'};
    searchFilter:any = "";
    serviceFilter:any = this.defaultFilter;
    statusFilter:any =this.defaultFilter;
    entityFilter:any = this.defaultFilter;

    sortKey:string = "";
    sortDir:string = "DESC";

    defaultpayments:any[] = [];
    defaultCount:number = 0;

    status = [
       this.defaultFilter,
        {code:'VALIDATED', name:'Validé'},
        {code:'REJECTED', name:'Refusé'},
        {code:'WAITING_VALIDATION', name:'En attente'},
    ]

    services = [
        this.defaultFilter,
        {code:'MVOLA', name:'Mvola'},
        {code:'AIRTEL_MONEY', name:'Airtel Money'},
        {code:'ORANGE_MONEY', name:'Orange Money'},
    ]


    selectedPayment:any|null = null;
    actionDetail:string = "";
    actionComment:string = "";

  @ViewChild('filter') filter!: ElementRef;

  constructor(private paymentService: PaymentService, private router:Router, private appService:AppService, private toastrService:ToastrService) {}

    ngOnInit() {
      this.paymentService.getPayment()
      .pipe(
          finalize(() => { 
            this.loading = false;
          })
      )
      .subscribe(
          {
              error:(e:any)=>{
                this.toastrService.error(Enum.CRUD_MESSAGE.error);
              },
              next:(response:any) => {
                  this.payments = this.defaultpayments = response.data;
                  this.count = this.defaultCount = response.count;
              }
          }
      );

    }

    showMore() {
        this.loadingShowMore=true;
        let offset = this.payments.length;
        let filters:any = {
            service : this.serviceFilter?.code ,
            search : this.searchFilter,
            status : this.statusFilter?.code, 
        }
        if (this.sortKey) {
            filters['sortKey'] = this.sortKey;
            filters['sortDir'] = this.sortDir;
        } 
        this.paymentService.getPayment(offset, filters).subscribe(
            {
                error:(e:any)=>{
                   this.loadingShowMore =false;
                   this.toastrService.error("Une erreur s'est produite");
                },
                next:(response:any) => {
                    this.loadingShowMore=false;
                    this.payments = this.defaultpayments = [...this.payments,...response.data];
                    this.count = this.defaultCount = response.count;
                }
            }
        );
    }

    toggleFilterPopOver(op: Popover, event: any) {
        op.toggle(event);
    }

    search() {
        if (!this.searchFilter) {
            this.payments = this.defaultpayments;
            this.count = this.defaultCount;
            return;
        };
        this.applyFilter();
    }

    applyFilter(sort:boolean = false) {
        
        let filters:any = {
            service : this.serviceFilter?.code ,
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
        this.paymentService.getPayment(0, filters)
        .pipe(
            finalize(() => { 
                this.loading = false;
            })
        )        
        .subscribe(
            {
                error:(e:any)=>{
                   this.toastrService.error("Une erreur s'est produite");
                },
                next:(response:any) => {                   
                    if (!response) {
                        this.payments = [];
                        this.count =0;
                    } else {
                       this.payments = response.data;
                        this.count = response.count;
                    }                    
                }
            }
        );
    }

    isFilterCancelable() {
        return this.serviceFilter.code === 'ALL' && this.entityFilter.code === 'ALL' && this.statusFilter.code === 'ALL';
    }

    resetFilter() {
        this.searchFilter = this.defaultFilter;
        this.entityFilter = this.defaultFilter;
        this.statusFilter = this.defaultFilter;
        this.searchFilter = "";
        this.payments = this.defaultpayments;
        this.count = this.defaultCount;
    }

    sortBy(key:string) {
        this.sortKey = key;
        this.sortDir = this.sortDir === 'DESC' ? 'ASC' : 'DESC';
        this.applyFilter(true);
    }

    viewDetail(payment:any) {
        this.router.navigate(['/admin/payment/detail'], {queryParams:{_id: payment._id}});
    }

    getRef(id:number) {
		if (id<10) {
			return `000${id}`;
		} else if (id<100) {
			return `00${id}`;
		} else if (id<1000) {
            return `0${id}`;
        }
		return id;
	}

	getUrl(url:any) {
		return this.appService.IP_HOST+""+url;
	}

    viewAction(payment:any) {
        this.selectedPayment = payment;
        this.actionComment = payment.comment;
        this.actionDetail = payment.detail;
    }

    getStatusLabel(status:string) {
		switch (status) {
			case 'VALIDATED':
				return 'Validé';
			case 'WAITING_VALIDATION':
				return 'En attente';
			case 'REJECTED':
				return 'Refusé';
			default:
				return 'inconnu';
		}
	}

    getStatusSeverity(status: string) {
		switch (status) {
			case 'VALIDATED':
				return 'success';
			case 'WAITING_VALIDATION':
				return 'warn';
			case 'REJECTED':
				return 'danger';
			default:
				return 'primary';
		}
	}

    formatPhoneNumber(phoneNumber:string) {
        return this.appService.formatPhoneNumber(phoneNumber);
    }

    getServiceLogoIcon(service:string) {
        switch (service) {
            case Enum.PAYMENT_SERVICE.MVOLA :
                return 'images/mvola.png';
            case Enum.PAYMENT_SERVICE.AIRTEL_MONEY :
                return 'images/airtelmoney.png';
            case Enum.PAYMENT_SERVICE.ORANGE_MONEY :
                return 'images/orangemoney.png';
            default:
                return null;
        }
    }

    submitAction(status:string) {
        if (!this.selectedPayment || !status) {
            return;
        }
        this.loadingAction = true;
        const data = {
            status: status,
            detail: this.actionDetail,
            comment: this.actionComment,
            ref: this.selectedPayment.ref
        }
        this.paymentService.setStatus(data)
        .pipe(
            finalize(() => { 
                this.loadingAction = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error(Enum.CRUD_MESSAGE.error);
                },
                next:(response:any) => {
                    this.payments = this.payments.map(p => p.id === response.id ? { ...p, ...response } : p);
                    this.toastrService.success(Enum.CRUD_MESSAGE.success);
                }
            }
        );
    }
}

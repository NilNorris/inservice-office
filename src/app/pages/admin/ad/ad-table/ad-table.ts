import { SortIcon } from '@/components/sort-icon/sort-icon';
import { AdService } from '@/services/ad/ad-service';
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
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { finalize } from 'rxjs';
import { AppService } from 'src/app-service';

@Component({
  selector: 'app-ad-table',
  imports: [
	TableModule,
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
	RippleModule,
	IconFieldModule,
	ProgressSpinnerModule,
	PopoverModule,
	InputGroupModule,
	InputGroupAddonModule,
	SortIcon,
	DialogModule,
	FieldsetModule
  ],
  templateUrl: './ad-table.html',
  styleUrl: './ad-table.scss'
})
export class AdTable {
	ads: any[] = [];
	selectedAd:any|null = null;

	loading: boolean = true;
	loadingShowMore:boolean = false;
	count:number = 0;

	defaultFilter:Object =  {code:'ALL', name:'Tous'};
	searchFilter:any = "";
	categoryFilter:any = this.defaultFilter;
	statusFilter:any =this.defaultFilter;

	sortKey:string = "";
	sortDir:string = "DESC";

	defaultads:any[] = [];
	defaultCount:number = 0;

	isShowContent:boolean = false;
	isShowValidity:boolean = false;

	categories = [
		this.defaultFilter,
		{code:'STICKY', name:'Sticky Ad'},
		{code:'SPLASH', name:'Splash Promo'},
		{code:'NATIVE', name:'Native Ad'},
	];

	status = [
	   this.defaultFilter,
		{code:'ACTIVE', name:'Actif'},
		{code:'INACTIVE', name:'Inactif'},
		{code:'REJECTED', name:'Refusé'},
		{code:'WAITING_VALIDATION', name: 'En attente'},
		{code:'EXPIRED', name: 'Expiré'}
	]

  @ViewChild('filter') filter!: ElementRef;

  constructor(private adService: AdService, private router:Router, private appService:AppService) {}

	ngOnInit() {
	  this.adService.getAd(0)
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
				  this.ads = this.defaultads = response.data;
				  this.count = this.defaultCount = response.count;
			  }
		  }
	  );
	}

	getPaymentStatusInfo(status: string) {
		switch (status) {
			case 'VALIDATED':
				return {label: 'Validé', severity:'success'};
			case 'WAITING_VALIDATION':
				return {label: 'En attente', severity:'warn'};
			case 'REJECTED':
				return {label: 'Refusé', severity:'error'};
			default:
				return {label: 'Inconnu', severity:'primary'};
		}
	}

    getAdStatusInfo(status:string) {
        switch (status) {
			case 'ACTIVE':
				return {label: 'Actif', severity: 'success'};
			case 'INACTIVE':
				return {label: 'Inactif', severity: 'warn'};
            case 'EXPIRED':
                return {label: 'Expiré', severity: 'error'};
            case 'REJECTED':
                return {label: 'Refusé', severity: 'error'};
			default:
				return  {label: 'Inconnu', severity: 'primary'};
		}
    }

	showMore() {
		this.loadingShowMore=true;
		let offset = this.ads.length;
		let filters:any = {
			category : this.categoryFilter?.code,
			search : this.searchFilter,
			status : this.statusFilter?.code, 
		}
		if (this.sortKey) {
			filters['sortKey'] = this.sortKey;
			filters['sortDir'] = this.sortDir;
		} 
		this.adService.getAd(offset, filters).subscribe(
			{
				error:(e:any)=>{
				   
				},
				next:(response:any) => {
					this.loadingShowMore=false;
					this.ads = this.defaultads = [...this.ads,...response.data];
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
			search : this.searchFilter,
			status : this.statusFilter?.code, 
		}
		if (sort) {
			filters['sortKey'] = this.sortKey;
			filters['sortDir'] = this.sortDir;
		} else {
			this.sortKey = "";
		}
		this.adService.getAd(0, filters)
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
						this.ads = [];
						this.count =0;
					} else {
					   this.ads = response.data;
						this.count = response.count;
					}                    
				}
			}
		);
	}

	isFilterCancelable() {
		return this.categoryFilter.code === 'ALL' && this.statusFilter.code === 'ALL';
	}

	resetFilter() {
		this.searchFilter = this.defaultFilter;
		this.statusFilter = this.defaultFilter;
		this.searchFilter = "";
		this.ads = this.defaultads;
		this.count = this.defaultCount;
	}

	sortBy(key:string) {
		this.sortKey = key;
		this.sortDir = this.sortDir === 'DESC' ? 'ASC' : 'DESC';
		this.applyFilter(true);
	}

	showContent(ad:any) {
		this.selectedAd = ad;
		this.isShowContent = true;
	}

	showValidity(ad:any) {
		this.selectedAd = ad;
		this.isShowValidity = true;
	}

	hasContentText(ad:any|null) {
		if (!ad) return false;
		return ad.category === 'STICKY';
	}

	getRef(id:number) {
		if (id<10) {
			return `00${id}`;
		} else if (id<100) {
			return `0${id}`;
		}
		return id;
	}

	getUrl(url:any) {
		return this.appService.IP_HOST+""+url;
	}
}

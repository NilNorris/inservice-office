import { EntityService } from '@/services/entity/entity-service';
import { TipService } from '@/services/tip/tip-service';
import { Product, ProductService } from '@/pages/service/product.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from "primeng/dataview";
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from "primeng/selectbutton";
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { AppService } from 'src/app-service';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Popover, PopoverModule } from "primeng/popover";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { SelectModule } from 'primeng/select';
import { CategoryService } from '@/services/category/category-service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-tip-list',
  imports: [
    CommonModule, 
    DataViewModule, 
    FormsModule, 
    SelectButtonModule, 
    PickListModule,
    OrderListModule, 
    TagModule, 
    ButtonModule, 
    ConfirmDialogModule, 
    TooltipModule, 
    ProgressSpinnerModule, 
    PopoverModule, 
    InputGroupModule, 
    InputGroupAddonModule, 
    IconFieldModule, 
    InputIconModule,
    SelectModule,
    InputTextModule,
],
  templateUrl: './tip-list.html',
  styleUrl: './tip-list.scss',
  providers: [ProductService, ConfirmationService]
})
export class TipList {

    loading:boolean = false;
    loadingMore:boolean = false;
    entities:any[] = [];
    categories:any = [];
    tips:any[] = [];
    count:number = 0;

    defaultFilter:Object =  {code:'ALL', name:'Tous'};
    searchFilter:any = "";
    categoryFilter:any = this.defaultFilter;
    statusFilter:any =this.defaultFilter;
    entityFilter:any = this.defaultFilter;

    status = [
       this.defaultFilter,
        {code:'ACTIVE', name:'Actif'},
        {code:'INACTIVE', name:'Inactif'},
    ]

    defaultTips:any[] = [];
    defaultCount:number = 0;

    constructor(
        private router:Router, 
        private tipService:TipService, 
        private entityService:EntityService, 
        private appService:AppService, 
        private toastrService:ToastrService,
        private categoryService:CategoryService,
        private confirmationService: ConfirmationService
    ) {}
  
    ngOnInit() {
        this.tipService.getTip()
        .pipe(
            finalize(()=>{
                this.loading = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error("Une erreur s'est produite");
                },
                next:(response:any) => {
                    this.tips = this.defaultTips = response ? response.data : [];
                    this.count = this.defaultCount = response.count ?? 0;
                }
            }
        );

        this.entityService.getEntity().subscribe(
            {
                error:(e:any)=>{
                   this.toastrService.error("Une erreur s'est produite");
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

        this.categoryService.getCategoryCount().subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error("Une erreur s'est produite");
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
    }

    add() {
        this.router.navigate(['/admin/tip/form']);
    }

    edit(_id:string) {
        this.router.navigate(['/admin/tip/form'], {queryParams:{_id:_id}});
    }

    getSeverity(product: Product) {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warn';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return 'info';
        }
    }

    getUrl(url:any) {
        return this.appService.IP_HOST+""+url;
    }

    truncate(str:string) {
        if (str.length > 120) {
            return `${str.slice(0,120)}...`;
        }
        return str;
    }

    confirmDelete(_id:string) {
        this.confirmationService.confirm({
            message: 'Voulez vous vraiment supprimer cette astuce ?',
            header: 'Suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tipService.deleteTip(_id).subscribe(
                {
                    error:(e:any)=>{                        
                        this.toastrService.error("Une erreur s'est produite");
                    },
                    next:(response:any) => {
                        this.toastrService.success("Astuce supprimée avec succès");
                        this.tips = this.tips.filter((tip:any)=>tip._id !== _id);
                        this.count -= 1;
                    }
                }
            );
            }
        });
    }

    confirmToggleStatus(tip:any) {
        this.confirmationService.confirm({
            message: 'Voulez vous vraiment '+ (tip.is_active ? 'désactiver' : 'activer') +' cette astuce ?',
            header: 'Suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tipService.toggleStatus(tip._id).subscribe(
                {
                    error:(e:any)=>{                        
                        this.toastrService.error("Une erreur s'est produite");
                    },
                    next:(response:any) => {
                        const tip = this.tips.find((tip:any)=> tip._id === response._id);
                        if (tip) {
                            console.log('frfrf');
                            tip.is_active = response.is_active;
                        }
                        console.log(this.tips)
                    }
                }
            );
            }
        });
    }

    showMore() {
        this.loadingMore = true;
        let offset = this.tips.length;
        let filters:any = {
            category : this.categoryFilter?.code ,
            entity : this.entityFilter?.code,
            search : this.searchFilter,
            status : this.statusFilter?.code, 
        }
        this.tipService.getTip(offset, filters)
        .pipe(
            finalize(()=>{
                 this.loadingMore = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error("Une erreur s'est produite");
                },
                next:(response:any) => {
                    this.tips = this.defaultTips = [...this.tips,...response.data];
                    this.count = this.defaultCount = response.count ?? 0;
                }
            }
        );
    }

    applyFilter() {
        let filters:any = {
            search : this.searchFilter ?? "",
            status : this.statusFilter?.code, 
        }
        this.tipService.getTip(0, filters)
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
                        this.tips = [];
                        this.count =0;
                    } else {
                       this.tips = response.data;
                       this.count = response.count;
                    }                    
                }
            }
        );
    }

    toggleFilterPopOver(op: Popover, event: any) {
        op.toggle(event);
    }

    isFilterCancelable() {
        return this.categoryFilter.code === 'ALL' && this.entityFilter.code === 'ALL' && this.statusFilter.code === 'ALL';
    }

    resetFilter() {
        this.searchFilter = this.defaultFilter;
        this.entityFilter = this.defaultFilter;
        this.statusFilter = this.defaultFilter;
        this.searchFilter = "";
        this.tips = this.defaultTips;
        this.count = this.defaultCount;
    }

}

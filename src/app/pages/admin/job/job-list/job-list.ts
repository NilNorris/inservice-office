import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from "primeng/dataview";
import { SelectButtonModule } from "primeng/selectbutton";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '@/pages/service/product.service';
import { JobService } from '@/services/job/job-service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app-service';
import { TooltipModule } from 'primeng/tooltip';
import { JobForm } from "../job-form/job-form";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { finalize } from 'rxjs';
import { Popover, PopoverModule } from 'primeng/popover';
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-job-list',
  imports: [
    DataViewModule,
    SelectButtonModule,
    TagModule,
    FormsModule,
    ButtonModule,
    CommonModule,
    TooltipModule,
    JobForm,
    ProgressSpinnerModule,
    PopoverModule,
    InputGroupModule,
    InputGroupAddonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    ConfirmDialog
],
  templateUrl: './job-list.html',
  styleUrl: './job-list.scss',
  providers: [ConfirmationService]
})
export class JobList {
  jobs:any[] = [];
  count:number = 0;
  loading:boolean = false;
  loadingMore:boolean = false;
  isFormVisible:boolean = false;
  editingJob:any|null = null;

  defaultFilter:Object =  {code:'ALL', name:'Tous'};
  statusFilter:any =this.defaultFilter;
  searchFilter:string = "";
  status = [
      this.defaultFilter,
      {code:'ACTIVE', name:'Actif'},
      {code:'INACTIVE', name:'Inactif'},
  ]

  
      constructor(private jobService:JobService, private toastrService:ToastrService, private appService:AppService, private confirmationService:ConfirmationService) {}
  
      ngOnInit() {

        this.jobService.getJob(0).subscribe(
            {
                error: (e:any) => {
                    this.toastrService.error(e.statusText ?? 'Une erreur s\'est produite');
                },
                next: (response:any) => {                    
                    this.jobs = response.data ?? [];
                    this.count = response.count;
                },
            }
        );
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

    getUrl(url:string) {
      return this.appService.IP_HOST+url;
    }

    form(job:any|null = null) {
        this.isFormVisible = true;
        this.editingJob = null;
        if (job) {
          this.editingJob = { ...job };
        }
        console.log(this.editingJob);
    }

    onCloseForm() {
      this.isFormVisible = false;
      this.editingJob = null;
    }

    confirmDelete(_id:string) {
        this.confirmationService.confirm({
            message: 'Voulez vous vraiment supprimer cette astuce ?',
            header: 'Suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.jobService.deleteJob(_id).subscribe(
                {
                    error:(e:any)=>{                        
                        this.toastrService.error("Une erreur s'est produite");
                    },
                    next:(response:any) => {
                        this.toastrService.success("Offre d'emploi supprimée avec succès");
                        this.jobs = this.jobs.filter((job:any)=>job._id !== _id);
                        this.count -= 1;
                    }
                }
            );
            }
        }); 
    }

     showMore() {
        this.loadingMore = true;
        let offset = this.jobs.length;
        let filters:any = {
            status : this.statusFilter?.code, 
        }
        this.jobService.getJob(offset, filters)
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
                      this.jobs = [...this.jobs,...response.data];
                      this.count = response.count ?? 0;
                  }
              }
          );
    }

    toggleFilterPopOver(op: Popover, event: any) {
        op.toggle(event);
    }

    applyFilter() {
        let filters:any = {
            search : this.searchFilter ?? "",
            status : this.statusFilter?.code, 
        }
        this.jobService.getJob(0, filters)
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
                        this.jobs = [];
                        this.count =0;
                    } else {
                       this.jobs = response.data;
                       this.count = response.count;
                    }                    
                }
            }
        );
    }

    isFilterCancelable() {
        return this.statusFilter.code === 'ALL';
    }

    resetFilter() {
        this.statusFilter = this.defaultFilter;
        this.searchFilter = "";
        this.applyFilter();
    }

}

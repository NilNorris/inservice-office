import { CategoryService } from '@/services/category/category-service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from "primeng/table";
import { AppService } from 'src/app-service';
import { ButtonModule } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Enum } from '../../../../enum/enum';
import { finalize } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-category',
  imports: [
    TableModule, 
    ButtonModule, 
    DialogModule,
    FormsModule,
    CommonModule, 
    FileUploadModule,
    InputTextModule,
    TextareaModule,
    ConfirmDialog,
    TagModule,
  ],
  templateUrl: './category.html',
  styleUrl: './category.scss',
  providers: [ConfirmationService]
})
export class Category {
  categories:any[] = [];
  isVisibleForm:boolean = false;
  
  formSend: boolean = false;
  formAction: string = 'CREATE';
  formLoading: boolean = false;
  previewUrl: string | null = null;
  isChangeFile: boolean = false;

  icon: File | null = null;
  label:string = "";
  slug:string = "";
  description:string = "";

  editCategory:any|null = null;

  constructor(
    private categoryService:CategoryService, 
    private toastrService:ToastrService, 
    private appService:AppService,
    private confirmationService:ConfirmationService
  ) {}

  ngOnInit() {
    this.getCategoryCount();
  }

  getCategoryCount() {
    this.categoryService.getCategoryCount().subscribe(
        {
            error:(e:any)=>{
                this.toastrService.error(e.statusText ?? 'Une erreur s\'est produite');
            },
            next:(response:any) => {
              if (response) {
                this.categories = response;
              }                  
                
            }
        }
    );
  }

  getUrl(url:any) {
      return this.appService.IP_HOST+""+url;
  }

  changeFile() {
    this.isChangeFile = !this.isChangeFile;
    if (!this.isChangeFile) {
      this.icon = null;
    }
  }

  onFileSelected(event: any) {
    const input = event.originalEvent.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.icon = input.files[0];
  }

  onFileRemoved(event: any) {
    this.icon = null;
  }

  validateSlug(slug:string) {
    const re = /^[A-Z0-9_]+$/;
    return re.test(slug);
  }

  formClose() {
    this.isVisibleForm=false;
  }

  submit() {
    this.formSend = true;
    if (this.label && this.slug && this.validateSlug(this.slug)) {
        let formData = new FormData();
        if (this.icon) formData.append('icon', this.icon, this.icon.name);
        formData.append('label', this.label);
        formData.append('slug', this.slug);
        formData.append('description', this.description);
        if (this.formAction === 'CREATE') {
            if (!this.icon) {
                return;
            }
            this.categoryService.addCategory(formData)
            .pipe(
                finalize(()=>{
                    this.formClose();
                    this.getCategoryCount();
                })
            )
            .subscribe(
                {
                    next: (response:any) => {
                        this.toastrService.success(Enum.CRUD_MESSAGE.success);       
                    },
                    error: (e:any) => {
                        this.toastrService.error(Enum.CRUD_MESSAGE.error);
                    }
                }
            );
        } else {
            if (!this.editCategory) {
                this.toastrService.error("Référence de catégorie invalide");
                this.formClose();
                return;
            }
            formData.append('id', this.editCategory.id.toString());
            this.categoryService.editCategory(formData)
            .pipe(
                finalize(()=>{
                    this.formClose();
                    this.getCategoryCount();
                })
            )
            .subscribe(
                {
                    next: (response:any) => {
                        this.toastrService.success(Enum.CRUD_MESSAGE.success);          
                    },
                    error: (e:any) => {
                        this.toastrService.error(Enum.CRUD_MESSAGE.error);
                    }
                }
            );
        }
    }
  }

  form(category:any|null = null) {
    this.editCategory = category;
    if (category) {
        this.formAction = 'UPDATE';
        this.label = category.label;
        this.slug = category.slug;
        this.description = category.description;
        this.previewUrl = this.getUrl(category.icon);
    } else {
        this.formAction = 'CREATE';
    }
    this.isVisibleForm = true;
  }

  confirmDelete(id:number) {
    this.confirmationService.confirm({
        message: Enum.CONFIRM_MESSAGE.delete,
        header: 'Suppression',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.categoryService.deleteCategory(id.toString()).subscribe(
            {
                error:(e:any)=>{                        
                    this.toastrService.error(Enum.CRUD_MESSAGE.error);
                },
                next:(response:any) => {
                    this.toastrService.success(Enum.CRUD_MESSAGE.success);
                    this.categories = this.categories.filter((category:any)=>category.id.toString() !== id.toString());
                }
            }
        );
        }
    }); 
}

}

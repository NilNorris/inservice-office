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
    TextareaModule
  ],
  templateUrl: './category.html',
  styleUrl: './category.scss'
})
export class Category {
  categories:any[] = [];
  isVisibleForm:boolean = false;
  file: File | null = null;
  formSend: boolean = false;
  formAction: string = 'CREATE';
  formLoading: boolean = false;
  previewUrl: string | null = null;
  isChangeFile: boolean = false;

  label:string = "";
  slug:string = "";
  description:string = "";

  constructor(private categoryService:CategoryService, private toastrService:ToastrService, private appService:AppService) {}

  ngOnInit() {
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
      this.file = null;
    }
  }

  onFileSelected(event: any) {
    const input = event.originalEvent.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.file = input.files[0];
  }

  onFileRemoved(event: any) {
    this.file = null;
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
    if (this.label && this.slug && this.validateSlug(this.slug) && this.file) {
      const data = {
        label: this.label,
        slug: this.slug,
        description: this.description,

      }
    }
  }

  form(category:any|null = null) {
    this.isVisibleForm = true;
  }
}

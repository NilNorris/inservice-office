import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { JobService } from '@/services/job/job-service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from 'src/app-service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-job-form',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToggleSwitchModule,
    FileUploadModule,
    DatePickerModule,
  ],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss'
})
export class JobForm {
  @Input() visible: boolean = false;
  @Input() job: any = null;
  @Output() onClose = new EventEmitter<string>();
  title: string = "";
  description: string = "";
  source: string = "";
  posted_date: Date | null = null;
  exp_date: Date | null = null;
  status: boolean = true;
  file: File | null = null;
  formSend: boolean = false;
  formAction: string = 'CREATE';
  formLoading: boolean = false;
  previewUrl: string | null = null;
  isChangeFile: boolean = false;

  constructor(private jobService: JobService, private toastrService: ToastrService, private router: Router, private appService: AppService) { }

  ngOnInit() {
   this.initValues();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initValues();
  }

  initValues() {
    this.formAction = this.job ? 'UPDATE' : 'CREATE';
    this.title = this.job ? this.job.title : '';
    this.description = this.job ? this.job.description : '';
    this.status = this.job ? this.job.is_active : true;
    this.posted_date = this.job ? this.formatDateForPicker(this.job.posted_date) : null;
    this.exp_date = this.job ? this.formatDateForPicker(this.job.expiration_date) : null;
    this.previewUrl = this.job ? ( this.job.file ? this.appService.IP_HOST + '' + this.job.file : null) : null;
    this.source = this.job ? this.job.source : '';
  }

  close() {
    this.visible = false;
    this.onClose.emit('close');
  }

  submit() {
    this.formSend = true;
    if (this.title) {
      let formData = new FormData();
      if (this.file) formData.append('file', this.file, this.file.name);
      formData.append('status', this.status ? 'ACTIVE' : 'INACTIVE');
      formData.append('title', this.title);
      if (this.description) formData.append('description', this.description);
      if (this.source) formData.append('source', this.source);
      if (this.posted_date) formData.append('posted_date', this.formatDateToSql(this.posted_date));
      if (this.exp_date) formData.append('expiration_date', this.formatDateToSql(this.exp_date));
      if (this.formAction === 'CREATE') {
        if (this.file == null) {
          return;
        }
        this.formLoading = true;
        this.jobService.setJob(formData)
          .pipe(
            finalize(() => {
              this.formLoading = false;
              this.visible = false;
            })
          )
          .subscribe(
            {
              next: (response: any) => {
                this.toastrService.success("Opération réussie");
                window.location.reload();
              },
              error: (e: any) => {
                this.toastrService.error("Echec de l'opération");
              },
            }
          );
      } else {
        this.formLoading = true;
        formData.append('_id', this.job._id);
        if (this.isChangeFile && this.file === null) {
          console.log('oups');
          return;
        }
        this.jobService.editJob(formData)
          .pipe(
            finalize(() => {
              this.formLoading = false;
              this.visible = false;
            })
          )
          .subscribe(
            {
              next: (response: any) => {
                this.toastrService.success("Opération réussie");
                window.location.reload();
              },
              error: (e: any) => {
                this.toastrService.error("Echec de l'opération");
              },
            }
          );

      }
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

  changeFile() {
    this.isChangeFile = !this.isChangeFile;
    if (!this.isChangeFile) {
      this.file = null;
    }
  }

  formatDateForPicker(dateString: string) {
    console.log(dateString);
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      console.log(new Date(year, month, day));
      return new Date(year, month, day);
    }
    return null;
  }

  formatDateToSql(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

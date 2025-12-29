import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FluidModule } from "primeng/fluid";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { FileUploadModule } from "primeng/fileupload";
import { MessageService } from 'primeng/api';
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from 'primeng/multiselect';
import { EntityService } from '@/services/entity/entity-service';
import { ToastrService } from 'ngx-toastr';
import { TipService } from '@/services/tip/tip-service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppService } from 'src/app-service';
import { ChipModule } from "primeng/chip";

@Component({
  selector: 'app-tip-form',
  imports: [InputTextModule, TextareaModule, FluidModule, ToggleSwitchModule, FormsModule, CommonModule, FileUploadModule, ButtonModule, MultiSelectModule, ChipModule],
  templateUrl: './tip-form.html',
  styleUrl: './tip-form.scss'
})
export class TipForm {
    isActive:boolean = true;
    isVideo:boolean = false;

    _id:string = "";
	formAction:string = 'CREATE';
	formSend:boolean = false;
    formLoading:boolean = false;

    entities:any[] = [];
    
    coverImageFile: File|null = null;
    title: string = "";
    content: string = "";
    selectedEntities:any[]=[];
    status:boolean=true;
    attachments: any[] = [];  
    video:File|null = null;

    previewCoverImageUrl:string = "";
    previewVideo:any|null = null;
    isChangeCoverImage:boolean = false;
    isChangeVideo:boolean = false;
    currentAttachmentIds:any = [];
    currentAttachments:any = [];

    constructor(
        private entityService:EntityService, 
        private toastrService:ToastrService, 
        private tipService:TipService, 
        private router:Router, 
        private activatedRoute:ActivatedRoute, 
        private appService:AppService

    ) {}

    ngOnInit() {
        this.entityService.getEntity().subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error("Echec de chargement des entités");
                },
                next:(response:any) => {
                    this.entities = response;
                }
            }
        );

        const queryParams = this.activatedRoute.snapshot.queryParams;
		if (queryParams['_id']) {
			this._id=queryParams['_id'];
			this.formAction = 'UPDATE';
			this.tipService.getTipDetail(queryParams['_id']).subscribe(
				{
					error: (e)=> {
						this.toastrService.error("Erreur de chargement");
                        this.router.navigate(['/admin/tip']);
					},
					next: (response:any) => {
						this.title = response.title;
						this.content = response.content;
						this.selectedEntities = response.entities;
						this.status = response.is_active
                        this.isVideo = (response.video !== null);
                        this.previewCoverImageUrl = this.appService.IP_HOST+""+response.cover_image;
                        this.currentAttachmentIds = response.attachments.map((attachment:any) => attachment.id);
                        this.currentAttachments = response.attachments;
                        this.previewVideo = response.video;
                        console.log(this.currentAttachmentIds);
					}
				}
			);
		}
    }

  toggleIsVideo(event: any) {
    if (!this.isVideo) {
        this.video = null;
    }
  }

    onCoverImageSelected(event:any) {
		const input = event.originalEvent.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		this.coverImageFile = input.files[0];
	}

    onCoverImageRemoved(event:any) {
        this.coverImageFile = null;
    }

    onVideoSelected(event:any) {
		const input = event.originalEvent.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		this.video = input.files[0];
	}

    onVideoRemoved(event:any) {
        this.video = null;
    }
  

   onAttachmentSelected(event:any) {
		const input = event.originalEvent.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		for (let i=0;i<input.files.length;i++) {
			this.attachments.push(input.files[i]);
		}
	}

    onAttachmentRemoved(event:any) {
        this.attachments = this.attachments.filter((attachment:any) => attachment !== event.file);
    }

    submit() {
        this.formSend=true;
		if (this.title !== "" && this.selectedEntities.length > 0 ) {
            if (this.isVideo && this.video === null) {
                return;
            }
			let formData = new FormData();
			if (this.coverImageFile) formData.append('cover_image', this.coverImageFile, this.coverImageFile.name);
			formData.append('status', this.status ? 'ACTIVE' : 'INACTIVE');
			formData.append('title', this.title);
			formData.append('content', this.content);
			formData.append('entities[]', JSON.stringify(this.selectedEntities));
			this.attachments.forEach((attachment:any) => {
                if (attachment.id) {
                    formData.append('attachment_ids[]', attachment.id);
                } else {
                    formData.append('attachments[]', attachment);
                }				
			})
			if (this.isVideo && this.video) formData.append('video', this.video, this.video.name) ; else formData.append('video', "NULL");
			if (this.formAction==='CREATE') {
                if (this.coverImageFile === null) {
                    return;
                }
                this.formLoading=true;
				this.tipService.addTip(formData)
                .pipe(
                    finalize(()=>{
                        this.formLoading=false;
                    })
                )
                .subscribe(
					{
						next:(response:any)=>{
							this.toastrService.success('Opération réussie');
							if (!response.file) this.toastrService.error('Certains fichiers ne sont pas enregistrés')
							this.router.navigate(['/admin/tip']);                            
						},
						error:(e:any)=>{
							this.toastrService.error(e.error.message ?? 'une erreur est survenue');
						}
                        
					}
				);
			} else {
                if (this.isChangeCoverImage && this.coverImageFile === null) {
                    return;
                }
				formData.append('_id', this._id);
                this.currentAttachmentIds.forEach((currentAttachmentId:any) => {
                    formData.append('current_attachment_ids[]', currentAttachmentId);
                });                
                this.formLoading=true;
				this.tipService.setTip(formData)
                .pipe(
                    finalize(()=>{
                        this.formLoading=false;
                    })
                )
                .subscribe(
					{
						next:(response:any)=>{
							this.toastrService.success('Opération réussie');
							if (!response.file) this.toastrService.error('Certains fichiers ne sont pas enregistrés')
							this.router.navigate(['/admin/tip']);
						},
						error:(e:any)=>{
							this.toastrService.error(e.error.message ?? 'une erreur est survenue');
						},
                        complete:()=>{
                            this.formLoading=false;
                        }
					}
				);
			}
		}
    }

    changeCoverImage() {
        this.isChangeCoverImage = !this.isChangeCoverImage;
        if (!this.isChangeCoverImage) {
            this.coverImageFile = null;
        }
    }

    changeVideo() {
        this.isChangeVideo = !this.isChangeVideo;
        if (!this.isChangeVideo) {
            this.video = null;
        }
    }

    onCurrentAttachmentsRemoved(file:any) {
        this.currentAttachmentIds = this.currentAttachmentIds.filter((currentAttachmentId:any) => currentAttachmentId !== file.id);
    }

    formatName(name:string) {
        if (name.length > 12) {
            return `...${name.slice(-12)}`;
        }
        return name;
    }

    getVideoName(path:string) {
        return path.split('/').pop();
    }

    download(path:string) {
        this.appService.download(this.appService.IP_HOST+""+path);
    }
}

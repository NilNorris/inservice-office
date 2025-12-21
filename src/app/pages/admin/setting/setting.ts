import { Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { FluidModule } from "primeng/fluid";
import { Category } from "./category/category";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SettingService } from '@/services/setting/setting-service';
import { finalize } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastrService } from 'ngx-toastr';
import { Enum } from '@/enum/enum';

@Component({
  selector: 'app-setting',
  imports: [TableModule, FluidModule, Category, ToggleSwitchModule, CommonModule, FormsModule,ConfirmDialog, ButtonModule, ProgressSpinnerModule,],
  templateUrl: './setting.html',
  styleUrl: './setting.scss',
  providers: [ConfirmationService]
})
export class Setting {
    settings:any = [];
    loading_setting:boolean = false;

    appStatus:boolean = true;
    extranetStatus:boolean = true;
    inscriptionStatus:boolean = true;
    newAdStatus:boolean = true;
    newLicenceStatus:boolean = true;
    webProfileStatus:boolean = true;
    webSiteStatus:boolean = true;

    constructor(private confirmationService:ConfirmationService, private settingService:SettingService,  private toastrService:ToastrService, ) {}

    ngOnInit() {
        this.loading_setting = true;
        this.settingService.getSetting()
        .pipe(
            finalize(() => { 
              this.loading_setting = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error(Enum.CRUD_MESSAGE.error);
                },
                next:(response:any) => {
                    this.settings = response;
                }
            }
        );
      }

      onStatusChange(event:any, slug: string) {
        const data = {
            is_active:  event.checked,
            slug: slug
        }
        this.settingService.setSetting(data)
        .pipe(
            finalize(() => { 
              this.loading_setting = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error(Enum.CRUD_MESSAGE.error);
                },
                next:(response:any) => {
                    this.settings = this.settings.map((setting:any) =>
                        setting.id === response.id ? response : setting
                      );
                }
            }
        );
      }
}

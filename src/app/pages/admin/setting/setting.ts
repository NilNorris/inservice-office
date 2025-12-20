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

@Component({
  selector: 'app-setting',
  imports: [TableModule, FluidModule, Category, ToggleSwitchModule, CommonModule, FormsModule,ConfirmDialog, ButtonModule],
  templateUrl: './setting.html',
  styleUrl: './setting.scss',
  providers: [ConfirmationService]
})
export class Setting {
    appStatus:boolean = true;
    extranetStatus:boolean = true;
    inscriptionStatus:boolean = true;
    newAdStatus:boolean = true;
    newLicenceStatus:boolean = true;
    webProfileStatus:boolean = true;
    webSiteStatus:boolean = true;

    constructor(private confirmationService:ConfirmationService) {

    }
}

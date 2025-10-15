import { Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { FluidModule } from "primeng/fluid";
import { Category } from "./category/category";

@Component({
  selector: 'app-setting',
  imports: [TableModule, FluidModule, Category],
  templateUrl: './setting.html',
  styleUrl: './setting.scss'
})
export class Setting {

}

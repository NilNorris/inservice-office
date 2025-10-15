import { Routes } from "@angular/router";
import { CustomerTable } from "./customer-table/customer-table";
import { CustomerDetail } from "./customer-detail/customer-detail";

export default [
    { path: '', component: CustomerTable },
    { path: 'detail', component:CustomerDetail },
] as Routes;
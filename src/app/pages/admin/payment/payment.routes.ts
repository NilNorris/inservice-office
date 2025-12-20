import { Routes } from "@angular/router";
import { PaymentDetail } from "./payment-detail/payment-detail";
import { PaymentTable } from "./payment-table/payment-table";

export default [
    { path: 'detail', component: PaymentDetail },
    { path: '', component: PaymentTable },
] as Routes;
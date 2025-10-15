import { Routes } from "@angular/router";
import { TipList } from "./tip-list/tip-list";
import { TipForm } from "./tip-form/tip-form";


export default [
    { path: '', component: TipList },
    { path: 'form', component: TipForm },
] as Routes;
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sort-icon',
  imports: [],
  templateUrl: './sort-icon.html',
  styleUrl: './sort-icon.scss'
})
export class SortIcon {
    @Input() field:string = "";
    @Input() sortKey:string = "";
    @Input() sortDir:string = "ASC";
}

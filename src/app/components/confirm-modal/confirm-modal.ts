import { Component } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { Button } from "primeng/button";

@Component({
  selector: 'app-confirm-modal',
  imports: [Dialog, Button],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss'
})
export class ConfirmModal {
  displayConfirmation: any;

  closeConfirmation() {
    
  }

}

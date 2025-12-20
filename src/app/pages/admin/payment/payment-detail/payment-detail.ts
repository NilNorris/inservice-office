import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';
import { PaymentService } from '@/services/payment/payment-service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Enum } from '../../../../enum/enum';
import { AppService } from 'src/app-service';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-payment-detail',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule,
    ProgressSpinnerModule,
    TableModule,
    TextareaModule,
    AvatarModule,
    MessageModule,
    DialogModule,
    TagModule,
    ConfirmDialog
  ],
  templateUrl: './payment-detail.html',
  styleUrl: './payment-detail.scss',
  providers: [ConfirmationService]
})
export class PaymentDetail {
    actionDetail:string = "";
    actionComment:string = "";

    loading:boolean = false;
    loadingAction:boolean = false;
    loadingSaveDetailComment: boolean = false;

    payment:any|null = null;
    receivedAmount:number = 0;
    remainingAmount:number = 0;
    refundAmount:number = 0;
    breakdown:number = 0;
    isShowValidation:boolean = false;
    isShowRefusal:boolean = false;

    constructor(
        private paymentService:PaymentService, 
        private activatedRoute:ActivatedRoute, 
        private toastrService:ToastrService, 
        private router:Router,
        private appService:AppService,
        private confirmationService:ConfirmationService
    ) {

    }

    ngOnInit() {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams['_id']) {
            this.paymentService.getPaymentDetail(queryParams['_id'])
           .pipe(
                finalize(() => { 
                    this.loading = false;
                })
            )
            .subscribe(
                {
                    error:(e:any)=>{
                        this.toastrService.error('Une erreur s\'est produite');
                         this.router.navigate(['/admin/payment']);
                    },
                    next:(response:any) => {
                        this.payment = response;
                        this.remainingAmount = this.payment.amount_due - this.receivedAmount;
                        this.actionComment = this.payment.comment;
                        this.actionDetail = this.payment.detail;
                        this.breakdown = this.payment.breakdown;
                        this.receivedAmount = this.payment.received_amount;
                    }
                }
            );
        } else {
           this.toastrService.error('Réference de paiement non trouvé');
            this.router.navigate(['/admin/payment']);
        } 
    }

    getStatusLabel(status:string) {
		switch (status) {
			case 'VALIDATED':
				return 'Validé';
			case 'WAITING_VALIDATION':
				return 'En attente';
			case 'REJECTED':
				return 'Refusé';
			default:
				return 'inconnu';
		}
	}

    getStatusSeverity(status: string) {
		switch (status) {
			case 'VALIDATED':
				return 'success';
			case 'WAITING_VALIDATION':
				return 'warn';
			case 'REJECTED':
				return 'error';
			default:
				return 'primary';
		}
	}

    getServiceLogoIcon(service:string) {
        switch (service) {
            case Enum.PAYMENT_SERVICE.MVOLA :
                return 'images/mvola.png';
            case Enum.PAYMENT_SERVICE.AIRTEL_MONEY :
                return 'images/airtelmoney.png';
            case Enum.PAYMENT_SERVICE.ORANGE_MONEY :
                return 'images/orangemoney.png';
            default:
                return null;
        }
    }

    formatPhoneNumber(phoneNumber:string) {
        return this.appService.formatPhoneNumber(phoneNumber);
    }

    getRef(id:number) {
		if (id<10) {
			return `000${id}`;
		} else if (id<100) {
			return `00${id}`;
		} else if (id<1000) {
            return `0${id}`;
        }
		return id;
	}

    changeReceivedAmount() {
        this.remainingAmount = this.payment.amount_due - this.receivedAmount;
        this.breakdown = 0;
    }

    refuse() {
        this.submitAction('REJECTED');
    }

    showValidation() {
        this.isShowValidation = true;
    }

    showRefusal() {
        this.refundAmount = this.payment.breakdown + this.payment.remaining_amount;
        this.isShowRefusal = true;
    }

    setDetailComment() {
        this.loadingSaveDetailComment = true;
        const data = {
            detail:this.actionDetail,
            comment: this.actionComment,
            ref: this.payment.ref
        };
        this.paymentService.setDetailComment(data)
        .pipe(
            finalize(() => { 
                this.loadingAction = false;
                this.isShowValidation = false;
                this.loadingSaveDetailComment = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error(Enum.CRUD_MESSAGE.error);
                },
                next:(response:any) => {
                    this.actionDetail = response.detail;
                    this.actionComment = response.comment;
                    this.toastrService.success(Enum.CRUD_MESSAGE.success);
                }
            }
        );
    }

    submitAction(status:string) {
        if (!this.payment|| !status) {
            return;
        }
        this.loadingAction = true;
        const data = {
            status: status,
            received_amount: this.receivedAmount,
            remaining_amount: status === 'REJECTED' ? 0 : this.remainingAmount,
            breakdown:  status === 'REJECTED' ? 0 : this.breakdown,
            detail: this.actionDetail,
            comment: this.actionComment,
            ref: this.payment.ref
        }
        this.paymentService.setStatus(data)
        .pipe(
            finalize(() => { 
                this.loadingAction = false;
                this.isShowValidation = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error(Enum.CRUD_MESSAGE.error);
                },
                next:(response:any) => {
                    this.payment = response;
                    this.remainingAmount = this.payment.amount_due - this.receivedAmount;
                    this.toastrService.success(Enum.CRUD_MESSAGE.success);
                    this.actionComment = this.payment.comment;
                    this.actionDetail = this.payment.detail;
                    this.breakdown = this.payment.imputed_amount;
                    this.receivedAmount = this.payment.received_amount;
                }
            }
        );
    }

    setbreakdown() {
        this.breakdown = (this.remainingAmount >= this.payment?.user.credit) ?  this.breakdown = this.payment?.user.credit :  this.breakdown = this.remainingAmount;
        this.remainingAmount = this.payment.amount_due - this.receivedAmount - this.breakdown;
    }

}

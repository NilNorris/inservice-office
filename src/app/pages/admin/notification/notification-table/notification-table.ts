import { Enum } from '@/enum/enum';
import { NotificationService } from '@/services/notification/notification-service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageModule } from 'primeng/message';
import { finalize, pipe } from 'rxjs';
import { AppService } from 'src/app-service';

@Component({
  selector: 'app-notification-table',
  imports: [  FormsModule, MessageModule],
  templateUrl: './notification-table.html',
  styleUrl: './notification-table.scss'
})
export class NotificationTable {

    loading:boolean = false;
    notifications:any[] = [];

    constructor(private notificationService:NotificationService, private router:Router, private appService:AppService, private toastrService:ToastrService) {}

    ngOnInit() {
        this.loading = true;
        this.notificationService.getNotification()
        .pipe(
            finalize(() => { 
              this.loading = false;
            })
        )
        .subscribe(
            {
                error:(e:any)=>{
                    this.toastrService.error(Enum.CRUD_MESSAGE.error);
                },
                next:(response:any) => {
                    this.notifications = response;
                }
            }
        );
      }

}

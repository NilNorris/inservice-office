import { PhotoService } from '@/pages/service/photo.service';
import { Component, Input, OnInit } from '@angular/core';
import { GalleriaModule } from "primeng/galleria";
import { AppService } from 'src/app-service';

@Component({
  selector: 'app-customer-detail-portfolio',
  imports: [GalleriaModule],
  templateUrl: './customer-detail-portfolio.html',
  styleUrl: './customer-detail-portfolio.scss',
   providers: [ PhotoService]
})
export class CustomerDetailPortfolio implements OnInit {
  images!: any[];
  @Input() customer:any;

  constructor(private photoService:PhotoService, private appService:AppService) {}

  galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    ngOnInit() {
        this.photoService.getImages().then((images) => {
            console.log(images);
            this.images = images;
        });
    }

    getUrl(url:string) {
        return this.appService.IP_HOST+""+url;
    }

    
}

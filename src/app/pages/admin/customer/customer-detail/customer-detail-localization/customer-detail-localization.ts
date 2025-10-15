import { AfterViewInit, Component, computed, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import L from 'leaflet';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-customer-detail-localization',
  imports: [InputTextModule],
  templateUrl: './customer-detail-localization.html',
  styleUrl: './customer-detail-localization.scss'
})
export class CustomerDetailLocalization implements AfterViewInit{
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map: L.Map | null = null;
  pointMarker: L.Marker | null = null;
  @Input() localization: any[] = [];
  isInitialized:boolean = false;
  

   ngAfterViewInit(): void {
        setTimeout(() => { 
            this.initMap();
        }, 100);   
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['localization']) {
            this.initMap();
        }
    }

  initMap(): void {
    let latitude = this.localization && this.localization.length > 0 ? this.localization[0].latitude : -18.9136;
    let longitude = this.localization && this.localization.length > 0 ? this.localization[0].longitude : 47.5361;
    if (!this.isInitialized) {

        this.isInitialized = true;        
        this.map = L.map('mapContainer').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

      if (this.localization.length>0 && this.localization[0].latitude) this.setPoint(latitude, longitude);
     
  }

  setPoint(lat: any, lng: any) {
        const popupText = this.localization.length > 0 ? this.localization[0].address : '';
        this.pointMarker = this.addMarker(lat, lng, popupText);
    }


    addMarker(lat: number, lng: number, message?: string) {
        const divMarker = L.divIcon({
            className: 'my-custom-icon',
            html: `<div style="font-size: 24px; color: red;">
              <i class="pi pi-flag-fill"></i>
            </div>`, 
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });

        const marker = this.map ? L.marker([lat, lng], { icon: divMarker }).addTo(this.map) : null;
        if (message && marker) {
            marker.bindPopup(message).openPopup();
        }
        if (this.map) {
             this.map = this.map.setView([lat, lng], 13);
        }
        return marker;
    }
}

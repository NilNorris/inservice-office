import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-customer-detail-contact',
  imports: [],
  templateUrl: './customer-detail-contact.html',
  styleUrl: './customer-detail-contact.scss'
})
export class CustomerDetailContact {
  @Input() customer:any;

  getIcon(name:string) {
    switch(name.toLocaleLowerCase()) {
      case 'phone/mobile': return 'pi-phone text-blue-500';
      case 'whatsapp': return 'pi-whatsapp text-green-500';
      case 'facebook' : return 'pi-facebook text-blue-500';
      case 'instagram': return 'pi-instagram text-orange-500';
      case 'linkedin': return 'pi-linkedin text-blue-100';
      case 'email': return 'pi-envelope text-red-500';
      case 'siteweb': return 'pi-globe';
      case 'github': return 'pi-github';
      case 'youtube': return 'pi-youtube text-red-500';
      default: return 'pi-box';
    }
  }
}

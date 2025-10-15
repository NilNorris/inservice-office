import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import frLocale from '@fullcalendar/core/locales/fr';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-customer-detail-agenda',
  imports: [CommonModule, FullCalendarModule, TagModule, DialogModule, ButtonModule],
  templateUrl: './customer-detail-agenda.html',
  styleUrl: './customer-detail-agenda.scss'
})
export class CustomerDetailAgenda implements AfterViewInit, OnChanges {
  @Input() customer:any;
  isShowModal:boolean = false;
  dataModal:any = {};
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin], // Définissez les plugins ici
    initialView: 'dayGridMonth',
    locale: frLocale ,
    events: [],
    footerToolbar: {
        center: 'dayGridMonth,timeGridWeek,timeGridDay',
        left: '',
        right: ''
      },
    eventClick: this.handleEventClick.bind(this),
  };

  ngAfterViewInit(): void {
      this.updateEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['customer']) {
           this.updateEvent();
      }
  }

  handleEventClick(arg:any) {
    console.log('ato');
    const event = arg.event;
    let datePresent = "";
    if (event.allDay) {
        const start = this.formatDate(event.start);
        const end  = this.formatDate(event.end);
        datePresent = (event.extendedProps.oneDay) ? start : start+' à '+end;
    } else {
        const start_date = this.formatDate(event.start);
        const end_date  = this.formatDate(event.end);
        const start_hour = this.formatHour(event.extendedProps.start_hourStr);
        const end_hour = this.formatHour(event.extendedProps.end_hourStr);
        datePresent = (event.extendedProps.oneDay) ? start_date : start_date+' à '+end_date;
        datePresent += (event.extendedProps.sameHour) ? " | "+start_hour : " | "+start_hour+' à '+end_hour;
    }
    let data = {
        title: event.title,
        date: datePresent,
        detail: event.extendedProps.detail,
    }
    this.showModal(data);
  }

  
  handleDateClick(arg: DateClickArg) {
    
  }

  updateEvent() {
    console.log(this.customer);
    let _events:any[]=[];
    this.customer?.agenda.forEach((agenda:any)=>{
       let title = agenda.is_unavailability_info ? 'Indisponible' : agenda.title;
       let start =  agenda.start_date.split('T')[0];
       let end = agenda.end_date.split('T')[0];
       let color = agenda.is_unavailability_info ? 'red' : 'blue';
       let oneDay = (start == end);
       let sameHour = (agenda.start_hour == agenda.end_hour && agenda.start_hour != null);

       let _event = (agenda.start_hour==null) ?
            {
                id:agenda.id,
                title: title,
                start: start,
                end: this.dayPlusOne(end),
                allDay: true,
                backgroundColor:color,
                borderColor: color,
                extendedProps: {
                    id: agenda.id,
                    is_unavailability_info:agenda.is_unavailability_info,
                    oneDay:oneDay,
                    detail:agenda.detail
                }
            }
            :
            {
                id:agenda.id,
                title: title,
                startTime: (agenda.start_hour) ? agenda.start_hour.split('T')[1].split('Z')[0] : '',
                endTime: (agenda.start_hour) ? agenda.end_hour.split('T')[1].split('Z')[0] : '',
                startRecur: start,
                endRecur: this.dayPlusOne(end),
                allDay: (agenda.start_hour==null),
                backgroundColor:color,
                borderColor: color,
                extendedProps: {
                    id: agenda.id,
                    is_unavailability_info:agenda.is_unavailability_info,
                    oneDay:oneDay,
                    detail:agenda.detail,
                    sameHour:sameHour,
                    start_hourStr : agenda.start_hour.split('T')[1].split('Z')[0],
                    end_hourStr : agenda.end_hour.split('T')[1].split('Z')[0],
                }
            } ;
            console.log(_event);
       _events.push(_event);
    });
    this.calendarOptions.events = _events;
  }

  dayPlusOne(dateStr:any) {
    const end = new Date(dateStr);
    end.setDate(end.getDate()+1);
    return end.toISOString().split('T')[0];
  }

  formatDate(_date:any) {
    return _date.toISOString().split('T')[0];
  }

  formatHour(_hour:any) {
    return _hour.substring(0, 5);
  }

  showModal(data:any) {
    this.dataModal = data;
    this.isShowModal = true;
  }

  closeModal() {
    this.isShowModal = false;
  }
  
}

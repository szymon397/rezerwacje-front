import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importujemy CommonModule
import { CalendarEvent } from 'angular-calendar';
import { CalendarModule } from 'angular-calendar';
import { MatButtonModule } from '@angular/material/button';
import { ReservationService } from '../reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';

@Component({
  selector: 'app-calendar',
  standalone: true, // Jeśli używasz standalone componentów
  imports: [
    CommonModule, // ✅ Importujemy moduł, który zawiera 'date' pipe
    CalendarModule,
    MatButtonModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date(); // Data początkowa - bieżący miesiąc
  events: CalendarEvent[] = [];

  constructor(private reservationService: ReservationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchReservations();

    // 🔹 Subskrybujemy powiadomienia o zmianach i odświeżamy dane
    this.reservationService.getUpdateTrigger().subscribe(() => {
      this.fetchReservations();
    });
  }

  fetchReservations() {
    this.reservationService.getReservations().subscribe(data => {
      this.events = data.map(reservation => ({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
        title: `${reservation.sessionType} - ${reservation.status}`,
        color: {
          primary: reservation.status === 'potwierdzona' ? 'green' : 'red',
          secondary: reservation.status === 'potwierdzona' ? '#b2fab4' : '#ffcccb'
        }
      }));
    });
  }

  openReservationForm() {
    this.dialog.open(ReservationFormComponent, {
      width: '600px'
    });
  }

  previousMonth() {
    const prev = new Date(this.viewDate);
    prev.setMonth(prev.getMonth() - 1);
    this.viewDate = prev;
  }

  nextMonth() {
    const next = new Date(this.viewDate);
    next.setMonth(next.getMonth() + 1);
    this.viewDate = next;
  }
}

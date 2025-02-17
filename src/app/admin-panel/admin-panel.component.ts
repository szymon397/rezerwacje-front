import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule // 🔹 TERAZ POWINNO DZIAŁAĆ!
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  reservations: any[] = [];
  displayedColumns: string[] = ['email', 'phone', 'startDate', 'endDate', 'sessionType', 'status', 'actions'];

  constructor(private reservationService: ReservationService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchReservations();

    // 🔹 Nasłuchujemy na zmiany rezerwacji i odświeżamy listę
    this.reservationService.getUpdateTrigger().subscribe(() => {
      this.fetchReservations();
    });
  }

  fetchReservations() {
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
    });
  }

  updateStatus(id: string, newStatus: string) {
    this.reservationService.updateReservationStatus(id, newStatus).subscribe(() => {
      this.fetchReservations();
      this.reservationService.triggerUpdate();
      this.snackBar.open('✅ Status zaktualizowany!', 'OK', { duration: 3000 });
    });
  }
  
  deleteReservation(id: string) {
    this.reservationService.deleteReservation(id).subscribe(() => {
      this.fetchReservations();
      this.reservationService.triggerUpdate();
      this.snackBar.open('🗑️ Rezerwacja została usunięta.', 'OK', { duration: 3000 });
    });
  }
  
}

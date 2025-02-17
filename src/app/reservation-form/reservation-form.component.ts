import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule
  ],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent {
  reservationForm: FormGroup;
  sessionTypes = ['Portret', 'Ślubna', 'Rodzinna', 'Produktowa']; // Typy sesji
  existingReservations: any[] = []; // Przechowywanie istniejących rezerwacji

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ReservationFormComponent>,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {
    this.reservationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      sessionType: ['', Validators.required],
      description: [''],
      location: ['', Validators.required]
    });

    // Pobierz istniejące rezerwacje, aby sprawdzić, czy nowa nie koliduje
    this.reservationService.getReservations().subscribe(reservations => {
      this.existingReservations = reservations;
    });
  }

  checkAvailability(): boolean {
    const startDate = new Date(this.reservationForm.value.startDate).getTime();
    const endDate = new Date(this.reservationForm.value.endDate).getTime();

    return !this.existingReservations.some(reservation => {
      const existingStart = new Date(reservation.startDate).getTime();
      const existingEnd = new Date(reservation.endDate).getTime();
      return (startDate < existingEnd && endDate > existingStart); // Sprawdzenie konfliktu terminów
    });
  }

  submitReservation() {
    if (!this.checkAvailability()) {
      this.snackBar.open('⛔ Ten termin jest już zajęty!', 'OK', { duration: 3000 });
      return;
    }

    if (this.reservationForm.valid) {
      this.reservationService.addReservation(this.reservationForm.value)
        .subscribe({
          next: () => {
            this.reservationService.triggerUpdate();
            this.dialogRef.close();
            this.snackBar.open('✅ Rezerwacja została wysłana!', 'OK', { duration: 3000 });
          },
          error: (error) => {
            console.error('Błąd wysyłania:', error);
            this.snackBar.open('⚠️ Wystąpił błąd podczas wysyłania rezerwacji.', 'OK', { duration: 3000 });
          }
        });
    } else {
      this.snackBar.open('⚠️ Formularz zawiera błędy, popraw dane.', 'OK', { duration: 3000 });
    }
  }
}

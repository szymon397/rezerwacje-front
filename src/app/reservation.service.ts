import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationsUpdated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getReservations(): Observable<any[]> {
    return this.http.get<any[]>('https://rezerwacje-backend-production.up.railway.app/api/reservations');
  }

  updateReservationStatus(id: string, status: string): Observable<any> {
    return this.http.put(`https://rezerwacje-backend-production.up.railway.app/api/reservations/${id}`, { status });
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`https://rezerwacje-backend-production.up.railway.app/api/reservations/${id}`);
  }

  addReservation(data: any): Observable<any> {
    return this.http.post(`https://rezerwacje-backend-production.up.railway.app/api/reservations`, data);
  }

  triggerUpdate() {
    this.reservationsUpdated.next(true);
  }

  getUpdateTrigger(): Observable<boolean> {
    return this.reservationsUpdated.asObservable();
  }
}

import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', component: CalendarComponent }, // Strona główna - Kalendarz
  { path: 'admin', component: AdminPanelComponent }, // Panel administratora
];

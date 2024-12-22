import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';
import { PatientDataComponent } from './patient-data/patient-data.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'patient-data', component: PatientDataComponent, canActivate: [AuthGuard] },
];

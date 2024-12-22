import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import FHIR from 'fhirclient';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      await FHIR.oauth2.ready();
      return true;
    } catch (error) {
      console.error('User is not authenticated:', error);
      this.router.navigate(['/']);
      return false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import FHIR from 'fhirclient';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Component({
  selector: 'app-callback',
  template: '<p>Loading...</p>',
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router, private oidcSecurityService: OidcSecurityService) {}

  ngOnInit(): void {
    FHIR.oauth2
      .ready()
      .then(client => {
        const patientUrl = this.returnPatientUrl(client);//client.user.fhirUser?.toString(); // Ensure fhirUser is a string
        if (!patientUrl) {
          throw new Error('Patient URL (fhirUser) is undefined');
        }
        console.log(patientUrl);
        return client.request(patientUrl); // Fetch patient data
      })
      .then(patient => {
        console.log('Patient Data:', patient);
        // Store patient data in a service or state for later use
        this.router.navigate(['/patient-data']); // Redirect to patient data page
      })
      .catch(error => {
        console.error('Error during client initialization or patient fetch:', error);
        this.router.navigate(['/']); // Redirect back to login on error
      });
  }

  returnPatientUrl(token: any): string | null {
    let patientId = '';
    let decoded: any = {};

    this.oidcSecurityService.getAccessToken().subscribe(token => {
      if (token?.length > 0) {
        decoded = this.decodeToken(token); 

        const fhirContext = decoded['fhirContext']; // Access fhirContext
        if (fhirContext && fhirContext.length > 0) {
          const patientReference = fhirContext[0].myReference; 
          patientId = patientReference; //  Get the full Patient link
        }
      }
    });

    return patientId; 
  }

  decodeToken(token: string) {
    return jwtDecode<JwtPayload>(token);
  }
}

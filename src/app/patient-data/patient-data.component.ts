import { Component, OnInit } from '@angular/core';
import FHIR from 'fhirclient';
import { MatCard } from '@angular/material/card';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatList, MatListItem } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { HttpService } from '../services/http.service';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from '../services/util.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html',
  styleUrls: ['./patient-data.component.scss'],
  imports: [CommonModule, MatCard, MatList, MatListItem, MatSidenavModule, MatSpinner,MatTableModule]
})
export class PatientDataComponent implements OnInit {
  constructor( private oidcSecurityService: OidcSecurityService,
    private httpService: HttpService,
    private fb: UntypedFormBuilder,
    private utilService: UtilService,
  ) {}
  patientData: any;
  //errorMessage: any;

  //isLoading: boolean = true;

  // ngOnInit(): void {
  //   FHIR.oauth2
  //     .ready()
  //     .then(client => {
  //       const patientUrl = client.user.fhirUser?.toString() + "/$everything"; // Ensure fhirUser is a string
  //       if (!patientUrl) {
  //         throw new Error('Patient URL (fhirUser) is undefined');
  //       }
  //       return client.request(patientUrl); // Fetch patient data
  //     })
  //     .then(patient => {
  //       console.log('Patient Data:', patient);
  //       this.patientData = patient.entry[0].resource; // Store patient data for display
  //       this.isLoading = false; // Stop loading
  //     })
  //     .catch(error => {
  //       console.error('Error fetching patient data:', error);
  //       this.errorMessage = 'Failed to fetch patient data. Please try again later.';
  //       this.isLoading = false; // Stop loading
  //     });
  // }

  // getObservations(): void {
  //   if (!this.patientData) {
  //     return; // Make sure patientData is available
  //   }

  //   this.client.request(`Observation?patient=${this.patientData.id}`)
  //     .then(observationsBundle => {
  //       console.log('Observations:', observationsBundle);
  //       this.observations = observationsBundle.entry.map(entry => entry.resource as FHIR.Observation); 
  //       this.isLoading = false;
  //     })
  //     .catch(error => {
  //       console.error('Error fetching observations:', error);
  //       this.errorMessage = 'Failed to load observations.';
  //       this.isLoading = false;
  //     });
  // }
  showLoadingBar = false;
  patientId: string = "";
  searchTypeHeader: string = "";
  customQuery = '';
  bundleFound: {} | undefined;
  queryFormGroup: UntypedFormGroup | undefined;

  observations: any[] = []; // Add an array to store observations
  errorMessage: any;
  isLoading: boolean = true;
  client: any; // Add a property to store the FHIR client

  ngOnInit(): void {
    // FHIR.oauth2
    //   .ready()
    //   .then(client => {
    //     this.client = client; // Store the client instance
    //     const patientUrl = this.returnPatientId(this.client) + "/$everything"; 
    //     if (!patientUrl) {
    //       throw new Error('Patient URL (fhirUser) is undefined');
    //     }
    //     return client.request(patientUrl); 
    //   })
    //   .then(patient => {
    //     console.log('Patient Data:', patient);
    //     this.patientData = patient.entry[0].resource; 
    //     this.getObservations(); // Fetch observations after getting patient data
    //   })
    //   .catch(error => {
    //     console.error('Error fetching patient data:', error);
    //     this.errorMessage = 'Failed to fetch patient data. Please try again later.';
    //     this.isLoading = false; 
    //   });
    this.queryFormGroup = this.fb.group({
      query: new UntypedFormControl(`${environment.fhirEndpointUri}/`, Validators.required),
      queryHeaders: this.fb.array([]),
      persistAuthorizationHeader: new UntypedFormControl(),
      persistHeaders: new UntypedFormControl()
    });

    //this.checkIfPersistHeaderSelectionWasMadePrevious();
  }

  getPatientIdFromToken(token: string): string | null {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const fhirContext = decodedToken.fhirContext;

      if (fhirContext && fhirContext.length > 0) {
        const patientReference = fhirContext[0].myReference; // Assuming the first entry is the patient
        const patientLink = patientReference; // Extract the Link from the reference
        return patientLink;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    return null; // Return null if there's an error or no patient ID found
  }

  getObservations(): void {
    if (!this.patientData) {
      return; // Make sure patientData is available
    }

    this.client.request(`Observation?patient=${this.patientData.id}`)
      .then((observationsBundle: { entry: any[]; }) => {
        console.log('Observations:', observationsBundle);
        this.observations = observationsBundle.entry.map(entry => entry.resource); 
        this.isLoading = false;
      })
      .catch((error: any) => {
        console.error('Error fetching observations:', error);
        this.errorMessage = 'Failed to load observations.';
        this.isLoading = false;
      });
  }

  decodeToken(token: string) {
    return jwtDecode<JwtPayload>(token);
  }

  returnPatientId(token: any): string | null {
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

}

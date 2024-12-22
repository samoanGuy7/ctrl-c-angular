import { Injectable } from '@angular/core';
import FHIR from 'fhirclient';

@Injectable({
  providedIn: 'root',
})
export class FhirService {
  private client: any;

  /**
   * Initializes the FHIR client by checking the SMART on FHIR session.
   */
  async initialize(): Promise<void> {
    try {
      this.client = await FHIR.oauth2.ready();
      console.log('FHIR client initialized:', this.client);
    } catch (error) {
      console.error('Error initializing FHIR client:', error);
      throw error;
    }
  }

  /**
   * Retrieves patient data from the FHIR server.
   * @returns A Promise with the patient resource.
   */
  async getPatientData(): Promise<any> {
    if (!this.client) {
      throw new Error('FHIR client not initialized');
    }

    try {
      const patient = await this.client.patient.read();
      console.log('Patient data retrieved:', patient);
      return patient;
    } catch (error) {
      console.error('Error fetching patient data:', error);
      throw error;
    }
  }

  /**
   * Fetches observations for the logged-in patient.
   * @returns A Promise with the observations.
   */
  async getPatientObservations(): Promise<any> {
    if (!this.client) {
      throw new Error('FHIR client not initialized');
    }

    try {
      const observations = await this.client.request(`Observation?patient=${this.client.patient.id}`, {
        pageLimit: 0, // Fetch all pages
        flat: true,   // Return a flat array of resources
      });
      console.log('Patient observations retrieved:', observations);
      return observations;
    } catch (error) {
      console.error('Error fetching patient observations:', error);
      throw error;
    }
  }

  /**
   * Makes a custom FHIR request.
   * @param path The FHIR resource path or query.
   * @returns A Promise with the FHIR resource(s).
   */
  async customRequest(path: string): Promise<any> {
    if (!this.client) {
      throw new Error('FHIR client not initialized');
    }

    try {
      const result = await this.client.request(path, {
        pageLimit: 0,
        flat: true,
      });
      console.log(`Custom request result for "${path}":`, result);
      return result;
    } catch (error) {
      console.error(`Error making custom FHIR request to "${path}":`, error);
      throw error;
    }
  }
}

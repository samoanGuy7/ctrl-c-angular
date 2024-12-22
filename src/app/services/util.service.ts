/*
 * // Copyright 2021 Omar Hoblos
 * //
 * // Licensed under the Apache License, Version 2.0 (the "License");
 * // you may not use this file except in compliance with the License.
 * // You may obtain a copy of the License at
 * //
 * //     http://www.apache.org/licenses/LICENSE-2.0
 * //
 * // Unless required by applicable law or agreed to in writing, software
 * // distributed under the License is distributed on an "AS IS" BASIS,
 * // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * // See the License for the specific language governing permissions and
 * // limitations under the License.
 */

import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
//import { errorObject } from '@interface/models'
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient
  ) { }

  returnObjectKeys(obj: Object) {
    return Object.keys(obj);
  }

  parseErrorMessage(obj: Object) {
    return "error";
  }

  copyToClipboard(value: string) {
    if (!navigator.clipboard) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = value;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    } else {
      navigator.clipboard.writeText(value)
        .then(() => {
          console.log("Copied the following token: " + value);
        })
        .catch(() => {
          console.log("There was an error copying this token.");
        });
    }
  }

  queryString(resource?: string, modifier?: string) {
    console.log(`Query sent to server: /${resource}${modifier}`);
    return `/${resource}` + modifier;
  }

  resetErrorObject(errorObject: string) {
    errorObject="";
  }

  decodeToken(token: string) {
    return jwtDecode<JwtPayload>(token);
  }

  cleanQueryString(query: string) {
    let cleanedText = query.trim();

    if (cleanedText.charAt(0) !== '/') {
      cleanedText = `/${cleanedText}`
    }
    return cleanedText;
  }

  getDate(value: number) {
    return new Date(value * 1000);
  }

  // returnTokenStatus() {
  //   let status: boolean;
  //   this.oidcSecurityService.isAuthenticated().subscribe(isAuthenticated => {
  //     status = isAuthenticated;
  //     return status;
  //   })
  // }

  returnTokenStatus(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated();
  }

  // returnPatientId() {
  //   let patientId = '';
  //   let patientInfo;
  //   this.oidcSecurityService.getAccessToken().subscribe(token => {
  //     if (token?.length > 0) {
  //       patientInfo = this.decodeToken(token);
  //       patientId = 
  //     }
  //   })
  //   return patientId;
  // }

  returnPatientId(): string | null {
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


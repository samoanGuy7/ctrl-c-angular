import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { getEnvironment } from '../core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UtilService } from '../services/util.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButton, MatCard, MatFormFieldModule, MatInputModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //issuer: string = getEnvironment('login', 'issuer'); // Default sandbox issuer
  //clientId: string = getEnvironment('login', 'client'); // Default sandbox client ID
  //issuer: string = 'https://smile-dev.iehp.org/smartauth-fhir';
  //clientId: string = 'iehpDemoSmart';
  // constructor(private oidcSecurityService: OidcSecurityService){}

  // ngOnInit(): void {}

  // authorize(): void {
  //   this.oidcSecurityService.authorize();
  // }
  tokenObjectForDisplay = {
    accessToken: 'No Token Found',
    idToken: 'No Token Found',
    claims: {},
    decodedAccessToken: null,
    expirationDate: null
  };

  //protected CURRENT_DATE = dayjs();
  //expirationMinutes: number;

  constructor(
    private utilService: UtilService,
    private oidcSecurityService: OidcSecurityService
  ) { }

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken, idToken, errorMessage }) => {
      this.checkIfTokenIsInSession(accessToken, idToken)
      if (errorMessage) {
        console.log(errorMessage)
      }
    });
  }

  ngAfterViewInit(): void {
    // if (this.expirationMinutes >= 0) {
    //   this.checkExpiration()
    // }
  }

  // returnTokenStatus() {
  //   return this.utilService.returnTokenStatus();
  // }

  returnTokenStatus(): void {
    this.utilService.returnTokenStatus().subscribe(status => {
      console.log('Token status:', status);
      // Perform any other actions you want based on the token status
    });
  }

  private checkIfTokenIsInSession(accessToken: string, idToken: string) {
    if (accessToken?.length > 0 || idToken?.length > 0) {

      const staticAccessToken = this.utilService.decodeToken(accessToken);
      const staticIdToken = this.utilService.decodeToken(idToken)
    }
    this.checkExpiration()
  }

  checkExpiration() {
    // if (this.tokenObjectForDisplay?.['expirationDate']) {
    //   this.expirationMinutes = this.tokenObjectForDisplay['expirationDate']?.diff(this.CURRENT_DATE, 'minute');
    //   console.log(`Time left for token: ${this.expirationMinutes}`);
    // }
  }

  login() {
    this.oidcSecurityService.authorize();
  }
}

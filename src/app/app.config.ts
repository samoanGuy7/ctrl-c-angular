import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth } from 'angular-auth-oidc-client';

import { environment } from '@env/environment'

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
  provideAuth({
    config: {
      authority: environment.issuer, // Replace with your OIDC issuer
      redirectUrl: environment.fhirEndpointUri,
      clientId: environment.clientId, // Replace with your client ID
      scope: environment.scopes, // Adjust scopes as necessary
      responseType: 'code',
      postLogoutRedirectUri: window.location.origin,
      silentRenew: true,
      useRefreshToken: true,
    },
  }),
  ]
};

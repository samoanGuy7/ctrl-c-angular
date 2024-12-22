import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '@env/environment';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: [
        {
          authority: environment.issuer,
          redirectUrl: environment.redirectUri,
          postLogoutRedirectUri: window.location.origin,
          clientId: environment.clientId,
          scope: environment.scopes,
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
          logLevel: LogLevel.Debug,
          issValidationOff: false,
        },
      ],
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { EnvService } from '../env/env.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  googleAuth = GoogleAuth;
  constructor(private envService: EnvService) {}

  async init() {
    this.googleAuth.initialize({
      clientId: this.envService.byKey('GOOGLE_AUTH_CLIENT_ID'),
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata'],
      grantOfflineAccess: true,
    });
  }

  async accessToken() {
    return (await this.googleAuth.signIn()).authentication.accessToken;
  }
}

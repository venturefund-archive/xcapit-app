import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { EnvService } from '../env/env.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  googleAuth = GoogleAuth;
  public walletAddress: string;

  constructor(private envService: EnvService, private http: HttpClient) {}

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

  createFile(accessToken: string, encryptedWallet: string): Observable<any> {
    return this.http.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      this._data(encryptedWallet),
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

  private _metadata() {
    return {
      name: `${this.walletAddress}`,
      mimeType: 'text/plain',
      parents: ['appDataFolder'],
    };
  }

  private _data(encryptedWallet: string) {
    const data = new FormData();
    data.append('metadata', new Blob([JSON.stringify(this._metadata())], { type: 'application/json' }));
    data.append('file', new Blob([encryptedWallet], { type: 'text/plain' }));
    return data;
  }
}

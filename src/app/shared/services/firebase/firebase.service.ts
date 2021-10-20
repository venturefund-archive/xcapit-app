import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import { environment } from 'src/environments/environment';
import { PlatformService } from '../platform/platform.service';
import { FirebaseApp } from '@firebase/app-types';
import { Plugins } from '@capacitor/core';
import { FirebaseNamespace } from '@firebase/app-types';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firebaseAnalytics = Plugins.FirebaseAnalytics;
  importedFirebase: FirebaseNamespace = firebase;
  constructor(private platformService: PlatformService) {}

  init() {
    let firebaseApp: FirebaseApp;
    if (this.platformService.isWeb() && !this.importedFirebase.apps.length) {
      this.firebaseAnalytics.initializeFirebase(environment.firebase);
    }

    firebaseApp = !this.importedFirebase.apps.length
      ? this.importedFirebase.initializeApp(environment.firebase)
      : this.importedFirebase.app();

    return firebaseApp;
  }
}

import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import { environment } from 'src/environments/environment';
import { PlatformService } from '../platform/platform.service';
import { FirebaseApp } from '@firebase/app-types';
import { FirebaseNamespace } from '@firebase/app-types';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firebaseAnalytics = FirebaseAnalytics;
  importedFirebase: FirebaseNamespace = firebase;
  constructor(private platformService: PlatformService) {}

  init(): FirebaseApp {
    if (this.platformService.isWeb() && !this.importedFirebase.apps.length) {
      this.firebaseAnalytics.initializeFirebase(environment.firebase);
    }

    return !this.importedFirebase.apps.length
      ? this.importedFirebase.initializeApp(environment.firebase)
      : this.importedFirebase.app();
  }
}

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { PlatformService } from '../platform/platform.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firebaseAnalytics = FirebaseAnalytics;
  importedFirebase = firebase;
  constructor(private platformService: PlatformService) {}

  init(): firebase.FirebaseApp {
    if (this.platformService.isWeb() && !this.importedFirebase.getApps().length) {
      this.firebaseAnalytics.initializeFirebase(environment.firebase);
    }

    return !this.importedFirebase.getApps().length
      ? this.importedFirebase.initializeApp(environment.firebase)
      : this.importedFirebase.getApp();
  }
}

import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export class DonationsIntroductionCompletedGuard {
  constructor(private navController: NavController, private storage: IonicStorageService) {}

  async canActivate(): Promise<boolean> {
    const introductionCompleted = !!await this.storage.get('donationsIntroductionCompleted');
    if (!introductionCompleted) this.goToIntroduction();
    return introductionCompleted;
  }

  private goToIntroduction() {
    this.navController.navigateForward('/donations/information');
  }
}

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PlannerIntroductionCompletedGuard implements CanActivate {
  constructor(private navController: NavController, private appStorage: AppStorageService) {}

  async canActivate(): Promise<boolean> {
    const introductionCompleted = !!await this.appStorage.get('planner_data');
    if (!introductionCompleted) this.goToIntroduction();
    return introductionCompleted;
  }

  private goToIntroduction() {
    this.navController.navigateForward('financial-planner/information');
  }
}

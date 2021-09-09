import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageWalletsService } from '../../services/storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptedToSGuard implements CanActivate {
  constructor(private storageWalletsService: StorageWalletsService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const hasAcceptedToS = await this.hasAcceptedToS();

    if (!hasAcceptedToS) await this.redirectToToSPage();

    return hasAcceptedToS;
  }

  async hasAcceptedToS(): Promise<boolean> {
    return await this.storageWalletsService.hasAcceptedToS();
  }

  async redirectToToSPage() {
    return await this.navController.navigateRoot(['wallets/create-first/disclaimer']);
  }
}

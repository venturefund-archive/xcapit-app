import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SimplifiedWallet } from '../../models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

export const simplifiedWalletGuard: CanActivateFn = async () => {
  const storage = inject(IonicStorageService);
  const navController = inject(NavController);
  const hasSimplifiedWallet = await new SimplifiedWallet(storage).value();

  if (hasSimplifiedWallet) return await navController.navigateRoot(['/simplified-home-wallet']);

  return !hasSimplifiedWallet;
};

// @Injectable({
//   providedIn: 'root',
// })
// export class SimplifiedWalletGuard implements CanActivate {
//   constructor(private _aStorage: IonicStorageService, private navController: NavController) {}
//
//   async canActivate(): Promise<boolean> {
//     const hasSimplifiedWallet = await new SimplifiedWallet(this._aStorage).value();
//
//     if (hasSimplifiedWallet) await this.redirectToPage();
//
//     return !hasSimplifiedWallet;
//   }
//
//   async redirectToPage() {
//     return await this.navController.navigateRoot(['/simplified-home-wallet']);
//   }
// }

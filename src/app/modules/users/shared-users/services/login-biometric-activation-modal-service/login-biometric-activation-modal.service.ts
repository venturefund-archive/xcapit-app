import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginBiometricActivationModalService {
  private get key(): string { return 'notShowBiometricModal'; }

  constructor(private ionicStorageService: IonicStorageService) { }

  async isShowModal(): Promise<boolean> {
    return !(await this.ionicStorageService.get(this.key));
  }

  async enableModal(): Promise<void> {
    await this.ionicStorageService.set(this.key, false)
  }

  async disableModal(): Promise<void> {
    await this.ionicStorageService.set(this.key, true)
  }
}

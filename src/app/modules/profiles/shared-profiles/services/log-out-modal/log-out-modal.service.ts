import { Injectable } from '@angular/core';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LogOutModalService {
  private get key(): string { return 'not_show_modal_users'; }

  constructor(private appStorageService: AppStorageService) { }

  async addUserToNotShowModal(user: string): Promise<void> {
    let usersList = await this.appStorageService.get(this.key);

    if (!usersList) {
      usersList = [];
    }
    
    usersList.push(user);
    await this.appStorageService.set(this.key, usersList)
  }

  async isShowModalTo(user: string): Promise<boolean> {
    const usersList = await this.appStorageService.get(this.key);
    return !(!!usersList && usersList.includes(user));
  }
}

import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements OnInit {
  hideFunds: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private storage: Storage) {}

  async ngOnInit() {
    this.hideFunds.next(await this.getHideFunds());
  }

  toggleHideFunds() {
    this.setHideFunds(!this.hideFunds.value);
  }

  public getHideFunds(): Promise<boolean> {
    return this.storage.get('hideFunds').then((data) => data === 'true');
  }

  public async setHideFunds(hideFunds: boolean) {
    const isSet = await this.storage.set('hideFunds', hideFunds.toString());
    this.hideFunds.next(hideFunds);
    return isSet;
  }
}

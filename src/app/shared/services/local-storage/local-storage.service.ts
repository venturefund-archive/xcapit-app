import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  hideFunds: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  hidePhrase: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private storage: Storage) {
    this.setInitialValue();
  }

  async setInitialValue() {
    this.hideFunds.next(await this.getHideFunds());
    this.hidePhrase.next(await this.getHidePhrase())
  }

  toggleHideFunds() {
    this.setHideFunds(!this.hideFunds.value);
  }

  toggleHidePhrase(){
    this.setHidePhrase(!this.hidePhrase.value);
  }

  public getHideFunds(): Promise<boolean> {
    return this.storage.get('hideFunds').then((data) => data === 'true');
  }

  public getHidePhrase(): Promise<boolean> {
    return this.storage.get('hidePhrase').then((data) => data === 'false')
  }

  public async setHideFunds(hideFunds: boolean) {
    const isSet = await this.storage.set('hideFunds', hideFunds.toString());
    this.hideFunds.next(hideFunds);
    return isSet;
  }

  public async setHidePhrase(hidePhrase: boolean){
    const isSet= await this.storage.set('hidePhrase', hidePhrase.toString());
    this.hidePhrase.next(hidePhrase)
    return isSet
  }



}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { isDefined } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class FundDataStorageService {
  pageKeys = {
    '/funds/fund-risk': 'fundName'
  };

  constructor(private storage: Storage) {}

  private async exists(key: string): Promise<boolean> {
    const data = await this.storage.get(key);
    return isDefined(data);
  }

  public setData(name: string, data: any) {
    this.storage.set(name, JSON.stringify(data));
  }

  public canActivatePage(page: string): Promise<boolean> {
    return this.exists(this.pageKeys[page]);
  }
}

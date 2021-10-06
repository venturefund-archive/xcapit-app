import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class FundDataStorageService {
  // Por cada page (url) indica la key del storage en la cual fijarse si existe para poder acceder a la url.
  // EJ: Para acceder a fund-duration debe existir la key fundName en el storage.
  pageKeys = {
    '/funds/fund-investment': 'fundName',
    '/funds/fund-take-profit': 'fundRiskLevel',
    '/funds/fund-stop-loss': 'fundTakeProfit',
  };

  allKeys = ['fundName', 'fundRiskLevel', 'fundCurrency', 'fundTakeProfit', 'fundStopLoss', 'fundRenew'];

  constructor(private storage: Storage) {}

  private async exists(key: string): Promise<boolean> {
    const data = await this.storage.get(key);
    return !!data;
  }

  public async setData(name: string, data: any) {
    return await this.storage.set(name, JSON.stringify(data));
  }

  public canActivatePage(page: string): Promise<boolean> {
    return this.exists(this.pageKeys[page]);
  }

  public async getData(name: string) {
    const data = await this.storage.get(name);
    return JSON.parse(data);
  }

  public async getFund() {
    let fund = {};
    for (const name of this.allKeys) {
      fund = { ...fund, ...(await this.getData(name)) };
    }
    return fund;
  }

  public clearAll() {
    for (const name of this.allKeys) {
      this.storage.remove(name);
    }
  }
}

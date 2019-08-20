import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { BinanceApikeyTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/binance-apikey-tutorial-modal/binance-apikey-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { ExtractTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/extract-tutorial-modal/extract-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { CaTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/ca-tutorial-modal/ca-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { BinanceTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/binance-tutorial-modal/binance-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { BinanceTransferTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/binance-transfer-tutorial-modal/binance-transfer-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { BinanceAddressTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/binance-address-tutorial-modal/binance-address-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { BinanceCheckTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/binance-check-tutorial-modal/binance-check-tutorial-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  getComponent(componentName: string) {
    switch (componentName) {
      case 'BinanceApikeyTutorialModalComponent':
        return BinanceApikeyTutorialModalComponent;
      case 'ExtractTutorialModalComponent':
        return ExtractTutorialModalComponent;
      case 'CaTutorialModalComponent':
        return CaTutorialModalComponent;
      case 'BinanceTutorialModalComponent':
        return BinanceTutorialModalComponent;
      case 'BinanceTransferTutorialModalComponent':
        return BinanceTransferTutorialModalComponent;
      case 'BinanceApikeyTutorialModalComponent':
        return BinanceApikeyTutorialModalComponent;
      case 'BinanceAddressTutorialModalComponent':
        return BinanceAddressTutorialModalComponent;
      case 'BinanceCheckTutorialModalComponent':
        return BinanceCheckTutorialModalComponent;
    }
  }
}

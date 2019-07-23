import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BinanceTutorialModalComponent } from './components/binance-tutorial-modal/binance-tutorial-modal.component';
import { CaTutorialModalComponent } from './components/ca-tutorial-modal/ca-tutorial-modal.component';
import { BinanceAddressTutorialModalComponent } from './components/binance-address-tutorial-modal/binance-address-tutorial-modal.component';
import { BinanceCheckTutorialModalComponent } from './components/binance-check-tutorial-modal/binance-check-tutorial-modal.component';
import { BinanceApikeyTutorialModalComponent } from './components/binance-apikey-tutorial-modal/binance-apikey-tutorial-modal.component';
// tslint:disable-next-line: max-line-length
import { BinanceTransferTutorialModalComponent } from './components/binance-transfer-tutorial-modal/binance-transfer-tutorial-modal.component';
import { ExtractTutorialModalComponent } from './components/extract-tutorial-modal/extract-tutorial-modal.component';

@NgModule({
  declarations: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent,
    BinanceApikeyTutorialModalComponent,
    BinanceTransferTutorialModalComponent,
    ExtractTutorialModalComponent
  ],
  imports: [SharedModule],
  entryComponents: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent,
    BinanceApikeyTutorialModalComponent,
    BinanceTransferTutorialModalComponent,
    ExtractTutorialModalComponent
  ],
  exports: [
    SharedModule,
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent,
    BinanceApikeyTutorialModalComponent,
    BinanceTransferTutorialModalComponent,
    ExtractTutorialModalComponent
  ]
})
export class SharedTutorialsModule {}

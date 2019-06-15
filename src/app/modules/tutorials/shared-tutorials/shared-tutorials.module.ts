import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BinanceTutorialModalComponent } from './components/binance-tutorial-modal/binance-tutorial-modal.component';
import { CaTutorialModalComponent } from './components/ca-tutorial-modal/ca-tutorial-modal.component';
import { BinanceAddressTutorialModalComponent } from './components/binance-address-tutorial-modal/binance-address-tutorial-modal.component';
import { BinanceCheckTutorialModalComponent } from './components/binance-check-tutorial-modal/binance-check-tutorial-modal.component';
import { BinanceApikeyTutorialModalComponent } from './components/binance-apikey-tutorial-modal/binance-apikey-tutorial-modal.component';

@NgModule({
  declarations: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent,
    BinanceApikeyTutorialModalComponent
  ],
  imports: [SharedModule],
  entryComponents: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent,
    BinanceApikeyTutorialModalComponent
  ],
  exports: [
    SharedModule,
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent,
    BinanceApikeyTutorialModalComponent
  ]
})
export class SharedTutorialsModule {}

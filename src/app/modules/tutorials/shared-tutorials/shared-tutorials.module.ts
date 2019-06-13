import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BinanceTutorialModalComponent } from './components/binance-tutorial-modal/binance-tutorial-modal.component';
import { CaTutorialModalComponent } from './components/ca-tutorial-modal/ca-tutorial-modal.component';
import { BinanceAddressTutorialModalComponent } from './components/binance-address-tutorial-modal/binance-address-tutorial-modal.component';
import { BinanceCheckTutorialModalComponent } from './components/binance-check-tutorial-modal/binance-check-tutorial-modal.component';

@NgModule({
  declarations: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent
  ],
  imports: [SharedModule],
  entryComponents: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent
  ],
  exports: [
    SharedModule,
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent,
    BinanceCheckTutorialModalComponent
  ]
})
export class SharedTutorialsModule {}

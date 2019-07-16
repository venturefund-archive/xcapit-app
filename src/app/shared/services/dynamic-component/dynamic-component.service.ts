import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { BinanceApikeyTutorialModalComponent } from 'src/app/modules/tutorials/shared-tutorials/components/binance-apikey-tutorial-modal/binance-apikey-tutorial-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  getComponent(componentName: string) {
    switch (componentName) {
      case 'BinanceApikeyTutorialModalComponent':
        return BinanceApikeyTutorialModalComponent;
    }
  }
}

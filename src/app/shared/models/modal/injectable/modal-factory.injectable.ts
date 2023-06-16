import { Injectable } from '@angular/core';
import { DefaultModalFactory } from '../factory/default/default-modal-factory';
import { ModalFactory } from '../factory/modal-factory.interface';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ModalFactoryInjectable {
  constructor(private modalController: ModalController, private translate: TranslateService) {}
  public create(
    _aModalController: ModalController = this.modalController,
    _aTranslateService: TranslateService = this.translate
  ): ModalFactory {
    return new DefaultModalFactory(_aModalController, _aTranslateService);
  }
}

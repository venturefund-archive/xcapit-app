import { Component, OnInit } from '@angular/core';
import { ComponentRef } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component/dynamic-component.service';

@Component({
  selector: 'app-help',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'tutorials.help.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item
          *ngFor="let tutorial of this.tutorials"
          button
          (click)="this.openTutorial(tutorial.component)"
          appTrackClick
          [dataToTrack]="{
            eventLabel: tutorial.component,
            description: tutorial.logMsg
          }"
        >
          <ion-icon slot="start" name="help-circle-outline"></ion-icon>
          <ion-label>
            {{ tutorial.title | translate }}
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./help.page.scss']
})
export class HelpPage implements OnInit {
  tutorials = [
    {
      title: 'tutorials.help.extract_tutorial',
      component: 'ExtractTutorialModalComponent',
      logMsg: 'Has opened extract tutorial'
    },
    {
      title: 'tutorials.help.ca_tutorial',
      component: 'CaTutorialModalComponent',
      logMsg: 'Has opened ca tutorial'
    },
    {
      title: 'tutorials.help.binance_tutorial',
      component: 'BinanceTutorialModalComponent',
      logMsg: 'Has opened binance tutorial'
    },
    {
      title: 'tutorials.help.binance_transfer_tutorial',
      component: 'BinanceTransferTutorialModalComponent',
      logMsg: 'Has opened binance transfer tutorial'
    },
    {
      title: 'tutorials.help.binance_apikey_tutorial',
      component: 'BinanceApikeyTutorialModalComponent',
      logMsg: 'Has opened binance apikey tutorial'
    },
    {
      title: 'tutorials.help.binance_address_tutorial',
      component: 'BinanceAddressTutorialModalComponent',
      logMsg: 'Has opened binance address tutorial'
    },
    {
      title: 'tutorials.help.binance_check_tutorial',
      component: 'BinanceCheckTutorialModalComponent',
      logMsg: 'Has opened binance check tutorial'
    }
  ];

  constructor(
    private modalController: ModalController,
    private dynamicComponentService: DynamicComponentService
  ) {}

  ngOnInit() {}

  openTutorial(tutorial: string) {
    const component = this.dynamicComponentService.getComponent(tutorial);
    return this.openModal(component);
  }

  async openModal(
    component: ComponentRef,
    methodName: string = '',
    callback: any = null
  ) {
    const modal = await this.modalController.create({ component });
    if (callback) {
      modal[methodName]().then(callback);
    }
    return await modal.present();
  }
}

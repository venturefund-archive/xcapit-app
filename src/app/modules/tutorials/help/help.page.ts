import { Component, OnInit } from '@angular/core';
import { ComponentRef } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { ExtractTutorialModalComponent } from '../shared-tutorials/components/extract-tutorial-modal/extract-tutorial-modal.component';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

@Component({
  selector: 'app-help',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/list"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'tutorials.help.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item button (click)="this.openExtractTutorial()">
          <ion-icon slot="start" name="help-circle-outline"></ion-icon>
          <ion-label>
            {{ 'tutorials.help.extract_tutorial' | translate }}
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./help.page.scss']
})
export class HelpPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private logsService: LogsService
  ) {}

  ngOnInit() {
    this.logsService.log(`{"message": "Has entered help"}`).subscribe();
  }

  openExtractTutorial() {
    this.logsService
      .log(`{"message": "Has opened extract tutorial"}`)
      .subscribe();
    return this.openModal(ExtractTutorialModalComponent);
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

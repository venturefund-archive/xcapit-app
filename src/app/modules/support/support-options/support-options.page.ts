import { Component, OnInit } from '@angular/core';
import { SUPPORTOPTIONS } from '../shared-support/constants/support-options';

@Component({
  selector: 'app-support-options',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="so__title">
          <ion-text class="ux-font-text-xl">
            {{ 'support.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div>
            <ion-list>
              <app-support-options-card *ngFor="let option of options" [option]="option"> </app-support-options-card>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./support-options.page.scss'],
})
export class SupportOptionsPage implements OnInit {
  options = SUPPORTOPTIONS;
  constructor() {}

  ngOnInit() {}
}

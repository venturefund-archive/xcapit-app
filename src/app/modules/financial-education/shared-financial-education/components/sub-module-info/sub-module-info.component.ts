import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-module-info',
  template:`
  <ion-header>
  <ion-toolbar color="primary" class="ux_toolbar no-border">
    <ion-buttons slot="start">
      <ion-back-button class="content__back" defaultHref="/donations/home"></ion-back-button>
    </ion-buttons>
    <ion-title class="ion-text-center">{{ 'donations.description_cause.header' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>
`,
  styleUrls: ['./sub-module-info.component.scss'],
})
export class SubModuleInfoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

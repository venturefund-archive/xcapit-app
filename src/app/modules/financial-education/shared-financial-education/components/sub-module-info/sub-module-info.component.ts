import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-sub-module-info',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="content__back" defaultHref="/donations/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ this.subModule.title | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <div class="smi ion-padding">
      <div class="smi__img">
        <img [src]="this.subModule.img" />
      </div>
      <div class="smi__description">
        <ion-text>{{ this.subModule.info | translate }} </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./sub-module-info.component.scss'],
})
export class SubModuleInfoComponent implements OnInit {
  @Input() subModule;

  constructor() {}

  ngOnInit() {}
}

import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
    <ion-content>
      <div class="smi ion-padding">
        <div class="smi__img">
          <img [src]="this.subModule.img" />
        </div>
        <div class="smi__description">
          <ion-text>{{ this.subModule.info | translate }} </ion-text>
        </div>
        <div class="smi__buttons">
          <div>
            <ion-button class="ux_button" expand="block" color="secondary" (click)="this.goToLearningMore()">{{
              'financial_education.shared.sub_module_info.button_1' | translate
            }}</ion-button>
          </div>
          <div>
            <ion-button class="ux_button ux-button-outlined" expand="block" (click)="this.goToStartTest()">{{
              'financial_education.shared.sub_module_info.button_2' | translate
            }}</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./sub-module-info.component.scss'],
})
export class SubModuleInfoComponent implements OnInit {
  @Input() subModule;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToLearningMore() {
    this.navController.navigateForward(this.subModule.learning_link);
  }

  goToStartTest() {
    this.navController.navigateForward(this.subModule.start_test_link);
  }
}

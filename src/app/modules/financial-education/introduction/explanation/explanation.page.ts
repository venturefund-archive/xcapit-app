import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-explanation',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="financial-education/introduction/financial-freedom"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'financial_education.introduction.explanation.header' | translate }}</ion-title>
        <ion-buttons class="back-button" slot="end">
          <app-share-education></app-share-education>
        </ion-buttons>
       
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <div class="ep__content ux_content">
          <div class="ep__content__title">
            <ion-text class="ux-font-text-xl">
              {{ 'financial_education.introduction.explanation.title' | translate }}
            </ion-text>
          </div>
          <div class="ep__content__items ">
            <app-explanation-item  *ngFor="let item of this.items" [item]="item"></app-explanation-item>
          </div>
        </div>
        <div class="ux_footer">
          <div class="ep__button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="ux_education_screenview_intro_2"
              type="submit"
              color="secondary"
              size="large"
              (click)="this.navigateToTests()"
            >
              {{ 'financial_education.introduction.explanation.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./explanation.page.scss'],
})
export class ExplanationPage implements OnInit {
  items = [
    {
      number:'financial_education.introduction.explanation.item_1.number',
      title: 'financial_education.introduction.explanation.item_1.title',
      icon: 'assets/img/financial-education/explanation-items/item_1.svg',
      description:'financial_education.introduction.explanation.item_1.description'
    },
    {
      number:'financial_education.introduction.explanation.item_2.number',
      title: 'financial_education.introduction.explanation.item_2.title',
      icon: 'assets/img/financial-education/explanation-items/item_2.svg',
      description:'financial_education.introduction.explanation.item_2.description'
    }, 
    {
      number:'financial_education.introduction.explanation.item_3.number',
      title: 'financial_education.introduction.explanation.item_3.title',
      icon: 'assets/img/financial-education/explanation-items/item_3.svg',
      description:'financial_education.introduction.explanation.item_3.description'
    },
  ];
  
  key =  'introductionCompleted';
  constructor(private trackService : TrackService, private navController: NavController, private storage : IonicStorageService) {}

  ngOnInit(){}

  ionViewWillEnter(){
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_education_screenview_intro_2'
    });
  }

  navigateToTests() {
    this.storage.set(this.key, true);
    this.navController.navigateForward('tabs/financial-education');
  }
}

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase';
import Swiper, { SwiperOptions, Navigation } from 'swiper';

@Component({
  selector: 'app-about-investor-profiles',

  template: `
    <ion-content [scrollY]="false">
      <swiper
        [config]="config"
        (slideNextTransitionStart)="this.slideNext()"
        (slidePrevTransitionStart)="this.slidePrev()"
      >
        <ng-template swiperSlide>
          <app-investor-profile-step
            [actualStep]="this.actualStep"
            [title]="'wealth_managements.about_investor_profile.conservative_profile.title' | translate"
            [subtitle]="'wealth_managements.about_investor_profile.conservative_profile.subtitle' | translate"
            imagePath="assets/img/investor-test/conservador.svg"
          ></app-investor-profile-step>
        </ng-template>
        <ng-template swiperSlide>
          <app-investor-profile-step
            [actualStep]="this.actualStep"
            [title]="'wealth_managements.about_investor_profile.moderated_profile.title' | translate"
            [subtitle]="'wealth_managements.about_investor_profile.moderated_profile.subtitle' | translate"
            imagePath="assets/img/investor-test/moderado.svg"
          ></app-investor-profile-step
        ></ng-template>
        <ng-template swiperSlide>
          <app-investor-profile-step
            [actualStep]="this.actualStep"
            [title]="'wealth_managements.about_investor_profile.aggressive_profile.title' | translate"
            [subtitle]="'wealth_managements.about_investor_profile.aggressive_profile.subtitle' | translate"
            imagePath="assets/img/investor-test/agresivo.svg"
          ></app-investor-profile-step>
        </ng-template>
      </swiper>
    </ion-content>
  `,
  styleUrls: ['./about-investor-profiles.page.scss'],
})
export class AboutInvestorProfilesPage implements OnInit {
  public config: SwiperOptions = {
    navigation: true,
  };
  actualStep: number;
  step;

  constructor() {}

  ngOnInit() {
    this.setInitialStep();
    Swiper.use([Navigation]);
  }

  ionViewWillEnter() {}

  setInitialStep() {
    this.actualStep = 0;
    this.step = 0;
    console.log(this.actualStep);
  }

  async slidePrev() {
    console.log('hacia atras');
    this.step = (await this.step) - 1;
    console.log(this.step);
    this.setActualStep(this.step);
  }

  async slideNext() {
    console.log('hacia adelante');
    this.step = (await this.step) + 1;
    console.log(this.step);
    this.setActualStep(this.step);
  }

  async setActualStep(step) {
    console.log('asdsa');
    this.actualStep = await step;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-first-steps',
  template: `
    <ion-content fullscreen>
      <ion-slides [options]="this.slideOpts" (ionSlideWillChange)="this.setActualStep()">
        <div data-swiper-parallax-x="33%" class="fs__parallax_bg"></div>
        <ion-slide>
          <app-step
            [actualStep]="this.actualStep"
            [sliderLength]="this.sliderLength"
            [title]="'tutorials.first_steps.step1.primary_text' | translate"
            [subtitle]="'tutorials.first_steps.step1.secondary_text' | translate"
            imagePath="assets/img/tutorials/onboarding/first_step.svg"
            (finishEvent)="this.finishOnboarding()"
            (slideNextEvent)="this.slideNext()"
          ></app-step>
        </ion-slide>
        <ion-slide>
          <app-step
            [actualStep]="this.actualStep"
            [sliderLength]="this.sliderLength"
            [title]="'tutorials.first_steps.step2.primary_text' | translate"
            [subtitle]="'tutorials.first_steps.step2.secondary_text' | translate"
            imagePath="assets/img/tutorials/onboarding/second_step.svg"
            (finishEvent)="this.finishOnboarding()"
            (slideBackEvent)="this.slideBack()"
            (slideNextEvent)="this.slideNext()"
          ></app-step>
        </ion-slide>
        <ion-slide>
          <app-step
            [actualStep]="this.actualStep"
            [sliderLength]="this.sliderLength"
            [title]="'tutorials.first_steps.step3.primary_text' | translate"
            [subtitle]="'tutorials.first_steps.step3.secondary_text' | translate"
            imagePath="assets/img/tutorials/onboarding/third_step.svg"
            (slideBackEvent)="this.slideBack()"
            (finishEvent)="this.finishOnboarding()"
          ></app-step>
        </ion-slide>
      </ion-slides>
    </ion-content>
  `,
  styleUrls: ['./first-steps.page.scss'],
})
export class FirstStepsPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 250,
    parralax: true,
  };

  @ViewChild(IonSlides, { static: true }) slide: IonSlides;
  actualStep: number;
  sliderLength: number;

  constructor(private navController: NavController, private storage: Storage) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.setActualStep();
    this.setSliderLength();
  }

  async setActualStep() {
    this.actualStep = (await this.slide.getActiveIndex()) + 1;
  }

  async setSliderLength() {
    this.sliderLength = await this.slide.length();
  }

  slideNext() {
    this.slide.slideNext();
  }

  slideBack() {
    this.slide.slidePrev();
  }

  finishOnboarding() {
    this.storage.set('FINISHED_ONBOARDING', true);
    this.navController.navigateForward(['tabs/home']);
  }
}

import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SkipProfileTestComponent } from '../shared-profiles/components/skip-profile-test/skip-profile-test.component';

@Component({
  selector: 'app-personalised-profile-test',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" name="back"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wealth_managements.investor_test.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ppt ion-padding">
      <form [formGroup]="this.to_do_in_app_form">
        <div class="ppt__question-one ux-font-text-lg">
          <ion-text>{{ 'profiles.personalised_profile_test.question_1' | translate }}</ion-text>
        </div>
        <div class="ppt__answers">
          <ion-item lines="none" *ngFor="let answer of this.toDoInApp">
            <div class="ppt__answers__item">
              <app-ux-checkbox
                divClass="ppt"
                class="ppt__answers__item__checkbox medium"
                [controlName]="answer.controlName"
                slot="start"
              ></app-ux-checkbox>
            </div>
            <div class="ppt__answers__text">
              <ion-text class="ux-font-text-base">
                {{ answer.text | translate }}
              </ion-text>
            </div>
          </ion-item>
        </div>
      </form>
      <form [formGroup]="this.crypto_experience_form">
        <div class="ppt__question-two ux-font-text-lg">
          <ion-text>{{ 'profiles.personalised_profile_test.question_2' | translate }}</ion-text>
        </div>
        <app-ux-radio-group>
          <ion-radio-group formControlName="radio_option">
            <div class="ppt__answers-two" *ngFor="let answer of this.cryptoExperience">
              <ion-item class="ppt__answers-two__item">
                <div class="ppt__answers-two__item__text">
                  <ion-text class="ux-font-text-base">{{ answer.text | translate }}</ion-text>
                </div>
                <ion-radio mode="md" slot="start" [value]="answer.value"></ion-radio>
              </ion-item>
            </div>
          </ion-radio-group>
        </app-ux-radio-group>
      </form>
    </ion-content>
    <ion-footer class="ppt__footer">
      <div class="ppt__footer__submit-button">
        <ion-button
          class="ux_button ppt__footer__submit-button__button"
          appTrackClick
          name="ux_donations_amount"
          color="secondary"
          [disabled]="!this.bothFormsValid()"
          expand="block"
          (click)="this.submitTest()"
          >{{ 'profiles.personalised_profile_test.button_primary' | translate }}</ion-button
        >
      </div>
      <div class="ppt__footer__other-time-button">
        <ion-button
          class="ux-button-outlined ppt__footer__other-time-button__button"
          appTrackClick
          name="ux_donations_amount"
          expand="block"
          (click)="this.skipTest()"
          >{{ 'profiles.personalised_profile_test.button_secondary' | translate }}</ion-button
        >
      </div>
    </ion-footer>
  `,
  styleUrls: ['./personalised-profile-test.page.scss'],
})
export class PersonalisedProfileTestPage implements OnInit {
  isModalPasswordOpen: boolean;
  isInfoModalOpen = false;
  eventPrefix = 'ux_user_';
  to_do_in_app_form = this.formBuilder.group({
    investor: false,
    remote: false,
    web3: false,
    gamer: false,
    other: false,
  });

  crypto_experience_form = this.formBuilder.group({
    radio_option: ['', Validators.required],
  });

  cryptoExperience = [
    {
      text: 'profiles.personalised_profile_test.crypto_experience.beginner',
      value: 'beginner',
    },
    {
      text: 'profiles.personalised_profile_test.crypto_experience.intermediate',
      value: 'intermediate',
    },
    {
      text: 'profiles.personalised_profile_test.crypto_experience.advanced',
      value: 'advanced',
    },
  ];

  toDoInApp = [
    {
      controlName: 'investor',
      text: 'profiles.personalised_profile_test.to_do_in_app.investor',
    },
    {
      controlName: 'remote',
      text: 'profiles.personalised_profile_test.to_do_in_app.remote',
    },
    {
      controlName: 'web3',
      text: 'profiles.personalised_profile_test.to_do_in_app.web3',
    },
    {
      controlName: 'gamer',
      text: 'profiles.personalised_profile_test.to_do_in_app.gamer',
    },
    {
      controlName: 'other',
      text: 'profiles.personalised_profile_test.to_do_in_app.other',
    },
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private trackService: TrackService,
    private modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {}

  submitTest() {
    this.sendToDoInAppEvent();
    this.sendCryptoExperienceEvent();
    this.navController.navigateRoot(['tabs/home']);
  }

  sendEvent(eventLabel: string) {
    this.trackService.trackEvent({
      eventAction: 'test_submit',
      description: window.location.href,
      eventLabel: this.eventPrefix + eventLabel,
    });
  }

  sendToDoInAppEvent() {
    const formValue = this.to_do_in_app_form.value;
    let event = 'other';
    if (formValue.web3) {
      event = 'web3';
    } else {
      if (formValue.gamer) {
        event = 'gamer';
      } else {
        if (formValue.remote) {
          event = 'remote';
        } else {
          if (formValue.investor) {
            event = 'investor';
          }
        }
      }
    }
    return this.sendEvent(event);
  }

  sendCryptoExperienceEvent() {
    return this.sendEvent(this.crypto_experience_form.value.radio_option);
  }

  skipTest() {
    if (this.crypto_experience_form.valid || this.isToDoInAppFormValid()) {
      this.showSkipProfileTest();
    }
  }

  bothFormsValid() {
    return this.crypto_experience_form.valid && this.isToDoInAppFormValid();
  }

  isToDoInAppFormValid() {
    return Object.values(this.to_do_in_app_form.controls)
      .map((option) => option.value)
      .some((value) => value);
  }

  async showSkipProfileTest() {
    if (this.isInfoModalOpen === false) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: SkipProfileTestComponent,
        componentProps: {},
        cssClass: 'ux-modal-skip-profile-test',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }
}

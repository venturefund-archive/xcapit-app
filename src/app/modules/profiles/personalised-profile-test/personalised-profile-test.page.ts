import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { TrackService } from 'src/app/shared/services/track/track.service';

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
              <app-ux-checkbox divClass="ppt" class="ppt__answers__item__checkbox medium" [controlName]="answer.controlName" slot="start"></app-ux-checkbox>
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
  to_do_in_app_form = this.formBuilder.group({
    option_a: false,
    option_b: false,
    option_c: false,
    option_d: false,
    option_e: false,
  });

  crypto_experience_form = this.formBuilder.group({
    radio_option: ['', Validators.required],
  });

  cryptoExperience = [
    {
      text: 'profiles.personalised_profile_test.crypto_experience.option_a',
      value: 'option_a',
    },
    {
      text: 'profiles.personalised_profile_test.crypto_experience.option_b',
      value: 'option_b',
    },
    {
      text: 'profiles.personalised_profile_test.crypto_experience.option_c',
      value: 'option_c',
    },
  ];

  toDoInApp = [
    {
      controlName: 'option_a',
      text: 'profiles.personalised_profile_test.to_do_in_app.option_a',
    },
    {
      controlName: 'option_b',
      text: 'profiles.personalised_profile_test.to_do_in_app.option_b',
    },
    {
      controlName: 'option_c',
      text: 'profiles.personalised_profile_test.to_do_in_app.option_c',
    },
    {
      controlName: 'option_d',
      text: 'profiles.personalised_profile_test.to_do_in_app.option_d',
    },
    {
      controlName: 'option_e',
      text: 'profiles.personalised_profile_test.to_do_in_app.option_e',
    },
  ];

  constructor(private formBuilder: UntypedFormBuilder, private trackService: TrackService) {}

  ngOnInit() {}

  submitTest() {
    this.sendToDoInAppEvent();
    this.sendCryptoExperienceEvent();
  }

  sendEvent(eventLabel: string) {
    this.trackService.trackEvent({
      eventAction: 'test_submit',
      description: window.location.href,
      eventLabel,
    });
  }
  sendToDoInAppEvent() {
    // TODO: Set correct event
    this.sendEvent('evento');
  }

  sendCryptoExperienceEvent() {
    // TODO: Set correct event
    this.sendEvent('evento');
  }

  skipTest() {
    if (this.crypto_experience_form.valid || this.isToDoInAppFormValid()) {
      // TODO: Open modal
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
}

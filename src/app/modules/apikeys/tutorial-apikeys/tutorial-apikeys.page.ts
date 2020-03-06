import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/success"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.tutorial_apikeys.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="akt__title">
            <app-ux-title>{{
              'apikeys.tutorial_apikeys.title' | translate
            }}</app-ux-title>
          </div>
          <div class="akt__text_before">
            <app-ux-text>
              {{ 'apikeys.tutorial_apikeys.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="akt__text_before_2">
            <app-ux-text>
              {{ 'apikeys.tutorial_apikeys.text_before_2' | translate }}
            </app-ux-text>
          </div>
          <div class="akt__steps_container">
            <div class="akt__steps_container__steps">
              <ion-grid>
                <ion-row>
                  <ion-col size="2" class="ion-text-center"
                    ><img
                      src="assets/img/apikeys/tutorial-apikeys/ux-step1.svg"
                      alt="Step 1"
                  /></ion-col>
                  <ion-col>
                    <app-ux-text>
                      {{ 'apikeys.tutorial_apikeys.step1' | translate }}
                    </app-ux-text>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="2" class="ion-text-center"
                    ><img
                      src="assets/img/apikeys/tutorial-apikeys/ux-step2.svg"
                      alt="Step 2"
                  /></ion-col>
                  <ion-col>
                    <app-ux-text>
                      {{ 'apikeys.tutorial_apikeys.step2' | translate }}
                    </app-ux-text>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="2" class="ion-text-center"
                    ><img
                      src="assets/img/apikeys/tutorial-apikeys/ux-step3.svg"
                      alt="Step 3"
                  /></ion-col>
                  <ion-col>
                    <app-ux-text>
                      {{ 'apikeys.tutorial_apikeys.step3' | translate }}
                    </app-ux-text>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="2" class="ion-text-center"
                    ><img
                      src="assets/img/apikeys/tutorial-apikeys/ux-step4.svg"
                      alt="Step 4"
                  /></ion-col>
                  <ion-col>
                    <app-ux-text>
                      {{ 'apikeys.tutorial_apikeys.step4' | translate }}
                    </app-ux-text>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </div>
          </div>
          <div class="akt__text_after">
            <app-ux-text>
              {{ 'apikeys.tutorial_apikeys.text_after' | translate }}
            </app-ux-text>
          </div>
          <div class="akt__text_help">
            <app-ux-text>
              <div class="akt__text_help__text">
                {{ 'apikeys.tutorial_apikeys.text_help' | translate }}
              </div>
              <div class="akt__text_help__link">
                <ion-button
                  name="Go To Help"
                  routerLink="/tutorials/help"
                  appTrackClick
                  fill="clear"
                  size="small"
                  >{{
                    'apikeys.tutorial_apikeys.text_help_link' | translate
                  }}</ion-button
                >
              </div>
            </app-ux-text>
          </div>
        </div>
        <div class="ux_footer">
          <div class="akt__next_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Next"
              type="button"
              color="uxsecondary"
              size="large"
              routerLink="/apikeys/insert-key"
            >
              {{ 'apikeys.tutorial_apikeys.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./tutorial-apikeys.page.scss']
})
export class TutorialApikeysPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}

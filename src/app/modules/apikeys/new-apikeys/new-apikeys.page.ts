import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-new-apikeys',
  template: `
    <ion-content>
      <div class="header-trama">
        <app-header-trama>
          <div class="header-trama-content">
            <div class="xcapit-logo">
              <app-xcapit-logo></app-xcapit-logo>
            </div>
            <app-stepper
              class="ion-padding-start ion-padding-end"
              [steps]="this.steps"
              [activeStep]="this.activeStep"
              (clickStep)="this.onlyPrev($event)"
            ></app-stepper>
          </div>
        </app-header-trama>
      </div>

      <ion-card class="stepper-card">
        <ion-card-content>
          <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
            <ion-slides [options]="{ allowTouchMove: false }">
              <ion-slide class="slide">
                <div class="slide__title">
                  <ion-text color="dark">
                    <h1>
                      {{ 'apikeys.new_apikeys.slide1_title' | translate }}
                    </h1>
                  </ion-text>
                </div>
                <div class="slide__content">
                  <div class="logo-binance">
                    <app-binance-logo></app-binance-logo>
                  </div>
                  <div class="slide__content__text">
                    {{ 'apikeys.new_apikeys.slide1_text' | translate }}
                  </div>
                  <div class="slide__content__options">
                    <ion-grid>
                      <ion-row>
                        <ion-col size="6">
                          <ion-button
                            appTrackClick
                            name="No exchange account"
                            type="button"
                            size="large"
                            expand="block"
                            color="xcprimary"
                            fill="outline"
                          >
                            {{
                              'apikeys.new_apikeys.slide1_option_no' | translate
                            }}
                          </ion-button>
                        </ion-col>
                        <ion-col size="6">
                          <ion-button
                            appTrackClick
                            name="Yes exchange account"
                            type="button"
                            size="large"
                            expand="block"
                            color="xcprimary"
                            (click)="this.slideTo(2)"
                          >
                            {{
                              'apikeys.new_apikeys.slide1_option_yes'
                                | translate
                            }}
                          </ion-button>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </div>
                  <div class="slide__content__link ion-margin-top">
                    <ion-button
                      appTrackClick
                      name="Help Link"
                      fill="clear"
                      type="button"
                      color="xcprimary"
                    >
                      {{ 'apikeys.new_apikeys.slide1_link_text' | translate }}
                    </ion-button>
                  </div>
                </div>
              </ion-slide>
              <ion-slide class="slide">
                <div class="slide__title">
                  <ion-text color="dark">
                    <h1>
                      {{ 'apikeys.new_apikeys.slide2_title' | translate }}
                    </h1>
                  </ion-text>
                </div>
                <div class="slide__content ion-margin-top">
                  <div class="slide__content__text">
                    {{ 'apikeys.new_apikeys.slide2_text1' | translate }}
                  </div>
                  <div class="slide__content__text">
                    {{ 'apikeys.new_apikeys.slide2_text2' | translate }}
                  </div>

                  <div class="slide__content__list ion-padding-top">
                    <app-nc-list>
                      <app-nc-list-item>
                        {{
                          'apikeys.new_apikeys.slide2_bullettext1' | translate
                        }}
                      </app-nc-list-item>
                      <app-nc-list-item>
                        {{
                          'apikeys.new_apikeys.slide2_bullettext2' | translate
                        }}
                      </app-nc-list-item>
                      <app-nc-list-item>
                        {{
                          'apikeys.new_apikeys.slide2_bullettext3' | translate
                        }}
                      </app-nc-list-item>
                      <app-nc-list-item>
                        {{
                          'apikeys.new_apikeys.slide2_bullettext4' | translate
                        }}
                      </app-nc-list-item>
                    </app-nc-list>
                  </div>

                  <div class="slide__content__options">
                    <ion-grid>
                      <ion-row>
                        <ion-col>
                          <ion-button
                            appTrackClick
                            name="List Next"
                            type="button"
                            size="large"
                            expand="block"
                            color="xcprimary"
                            (click)="this.slideTo(3)"
                          >
                            {{
                              'apikeys.new_apikeys.slide2_option_next'
                                | translate
                            }}
                          </ion-button>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </div>
                </div>
              </ion-slide>
              <ion-slide class="slide">
                <div class="slide__title">
                  <ion-text color="dark">
                    <h1>
                      {{ 'apikeys.new_apikeys.slide3_title' | translate }}
                    </h1>
                  </ion-text>
                </div>
                <div class="slide__content ion-margin-top">
                  <div class="slide__content__text">
                    {{ 'apikeys.new_apikeys.slide3_text' | translate }}
                  </div>
                  <div class="slide__content__form-controls">
                    <app-xcapit-input
                      controlName="apikey"
                      type="text"
                      inputmode="text"
                      label="API Key"
                    ></app-xcapit-input>
                  </div>
                  <div class="slide__content__options ion-margin-top">
                    <ion-grid>
                      <ion-row>
                        <ion-col>
                          <ion-button
                            appTrackClick
                            name="APIKEY Next"
                            type="button"
                            size="large"
                            expand="block"
                            color="xcprimary"
                            [disabled]="!this.form.get('apikey').valid"
                            (click)="this.slideTo(4, this.form.get('apikey'))"
                          >
                            {{
                              'apikeys.new_apikeys.slide3_option_next'
                                | translate
                            }}
                          </ion-button>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </div>
                </div>
              </ion-slide>
              <ion-slide class="slide">
                <div class="slide__title">
                  <ion-text color="dark">
                    <h1>
                      {{ 'apikeys.new_apikeys.slide4_title' | translate }}
                    </h1>
                  </ion-text>
                </div>
                <div class="slide__content ion-margin-top">
                  <div class="slide__content__text">
                    {{ 'apikeys.new_apikeys.slide4_text1' | translate }}
                  </div>
                  <div class="slide__content__text">
                    {{ 'apikeys.new_apikeys.slide4_text2' | translate }}
                  </div>
                  <div class="slide__content__form-controls">
                    <app-xcapit-input
                      controlName="secret_key"
                      type="text"
                      inputmode="text"
                      label="SECRET Key"
                    ></app-xcapit-input>
                  </div>
                  <div class="slide__content__options ion-margin-top">
                    <ion-grid>
                      <ion-row>
                        <ion-col>
                          <ion-button
                            appTrackClick
                            name="SECRETKEY Next"
                            size="large"
                            expand="block"
                            color="xcprimary"
                            type="submit"
                            [disabled]="
                              !this.form.valid ||
                              (this.submitButtonService.isDisabled | async)
                            "
                          >
                            {{
                              'apikeys.new_apikeys.slide4_option_next'
                                | translate
                            }}
                          </ion-button>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </div>
                </div>
              </ion-slide>
            </ion-slides>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styleUrls: ['./new-apikeys.page.scss']
})
export class NewApikeysPage implements OnInit {
  action: string;
  activeStep: number;
  steps: number;

  form: FormGroup = this.formBuilder.group({
    apikey: ['', [Validators.required]],
    secret_key: ['', [Validators.required]]
  });

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  constructor(
    public submitButtonService: SubmitButtonService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiApikeys: ApiApikeysService
  ) {}

  async ngOnInit() {
    this.action = this.route.snapshot.paramMap.get('action');
  }

  ionViewDidEnter() {
    this.setStepper();
  }

  handleSubmit() {
    if (this.form.valid) {
      // TODO: descomentar cuando este el endpoint
      // this.apiApikeys.crud.create(this.form.value);
      console.log({ data: this.form.value });
    }
  }

  async setStepper() {
    this.steps = await this.slides.length();
    this.activeStep = (await this.slides.getActiveIndex()) + 1;
  }

  slideTo(point: number, formControl: AbstractControl = null) {
    if (this.checkFormControl(formControl)) {
      this.activeStep = point;
      this.slides.slideTo(this.activeStep - 1);
    }
  }

  checkFormControl(formControl: AbstractControl) {
    if (formControl) {
      return formControl.valid;
    }
    return true;
  }

  async onlyPrev(stepClicked: any) {
    const activeSteps = (await this.slides.getActiveIndex()) + 1;
    if (activeSteps > stepClicked) {
      this.slideTo(stepClicked);
    }
  }
}

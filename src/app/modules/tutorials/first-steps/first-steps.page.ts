import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStatus } from '../../usuarios/shared-usuarios/enums/user-status.enum';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';

@Component({
  selector: 'app-first-steps',
  template: `
    <ion-content fullscreen>
      <ion-slides
        [options]="this.slideOpts"
        (ionSlideWillChange)="this.setActualStep()"
      >
        <!-- <div class="fs__parallax_bg"> -->
        <div data-swiper-parallax-x="33%" class="fs__parallax_bg"></div>
        <ion-slide>
          <div class="fs__content_slide">
            <div class="fs__content_slide__image">
              <img
                src="../../../../assets/img/tutorials/first-steps/welcome/step1.svg"
                alt="Account Config Image"
              />
            </div>
            <div class="fs__content_slide__bloob">
            <img
                src="../../../../assets/img/tutorials/first-steps/welcome/Blobs1.svg"
                alt="Blob"
              />
            </div>
            <div class="fs__content_slide__primary_text">
              <app-ux-title>
                {{ 'tutorials.first_steps.step1.primary_text' | translate }}
              </app-ux-title>
            </div>
            <div class="fs__content_slide__secondary_text">
              <app-ux-text class="ux-font-lato ux-fweight-regular ux-fsize-14">
                {{ 'tutorials.first_steps.step1.secondary_text' | translate }}
              </app-ux-text>
            </div>
            <div
              class="fs__content_slide__slide_step_show"
              *ngIf="
                this.userStatus?.status_name !== this.userStatusEnum.FROM_BOT
              "
            >
              <app-ux-slide-step-show
                [step]="this.actualStep"
                [total]="this.sliderLength"
              ></app-ux-slide-step-show>
            </div>

            <div class="fs__content_slide__button_next">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Ion Slide Next Button S1"
                size="large"
                expand="block"
                color="uxsecondary"
                (click)="
                  this.userStatus?.status_name !== this.userStatusEnum.FROM_BOT
                    ? this.slideNext()
                    : this.goToEditProfile()
                "
              >
                {{ 'tutorials.first_steps.step1.next_button' | translate }}
              </ion-button>
            </div>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="fs__content_slide">
            <div class="fs__content_slide__image">
              <img
                src="../../../../assets/img/tutorials/first-steps/binance-link/drawable-hdpi/Imagen 5.png"
                alt="Binance Link Image"
              />
            </div>
            <div class="fs__content_slide__primary_text">
              <app-ux-title>
                {{ 'tutorials.first_steps.step2.primary_text' | translate }}
              </app-ux-title>
            </div>
            <div class="fs__content_slide__secondary_text">
              <app-ux-text>
                {{ 'tutorials.first_steps.step2.secondary_text' | translate }}
              </app-ux-text>
            </div>
            <div class="fs__content_slide__slide_step_show">
              <app-ux-slide-step-show
                [step]="this.actualStep"
                [total]="this.sliderLength"
              ></app-ux-slide-step-show>
            </div>

            <div class="fs__content_slide__button_back">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Ion Slide Back Button S2"
                fill="clear"
                type="button"
                color="uxsecondary"
                (click)="this.slideBack()"
              >
                {{ 'tutorials.first_steps.step2.back_button' | translate }}
              </ion-button>
            </div>
            <div class="fs__content_slide__button_next">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Ion Slide Next Button S2"
                size="large"
                expand="block"
                color="uxsecondary"
                (click)="this.slideNext()"
              >
                {{ 'tutorials.first_steps.step2.next_button' | translate }}
              </ion-button>
            </div>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="fs__content_slide">
            <div class="fs__content_slide__image">
              <img
                src="../../../../assets/img/tutorials/first-steps/create-fund/drawable-hdpi/Imagen 7.png"
                alt="Create Fund Image"
              />
            </div>
            <div class="fs__content_slide__primary_text">
              <app-ux-title>
                {{ 'tutorials.first_steps.step3.primary_text' | translate }}
              </app-ux-title>
            </div>
            <div class="fs__content_slide__secondary_text">
              <app-ux-text>
                {{ 'tutorials.first_steps.step3.secondary_text' | translate }}
              </app-ux-text>
            </div>
            <div class="fs__content_slide__slide_step_show">
              <app-ux-slide-step-show
                [step]="this.actualStep"
                [total]="this.sliderLength"
              ></app-ux-slide-step-show>
            </div>

            <div class="fs__content_slide__button_config">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Ion Slide Config Button S3"
                type="button"
                expand="block"
                color="uxsecondary"
                routerLink="/profiles/personal-data"
              >
                {{ 'tutorials.first_steps.step3.config_button' | translate }}
              </ion-button>
            </div>
          </div>
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
  userStatus: any;
  userStatusEnum = UserStatus;

  constructor(
    private router: Router,
    private apiUsuarios: ApiUsuariosService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.setActualStep();
    this.setSliderLength();
  }

  ionViewWillEnter() {
    this.loadingService.enabled();
    this.apiUsuarios.status().subscribe((res: any) => {
      this.userStatus = res;
      this.loadingService.disabled();
    });
  }

  async setActualStep() {
    this.actualStep = await this.slide.getActiveIndex();
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

  goToEditProfile() {
    this.router.navigate(['profiles/user']);
  }
}

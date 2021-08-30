import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserStatus } from '../../usuarios/shared-usuarios/enums/user-status.enum';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';

@Component({
  selector: 'app-first-steps',
  template: `
    <ion-content fullscreen>
      <ion-slides [options]="this.slideOpts" (ionSlideWillChange)="this.setActualStep()">
        <!-- <div class="fs__parallax_bg"> -->
        <div data-swiper-parallax-x="33%" class="fs__parallax_bg"></div>
        <ion-slide>
          <div class="fs__content_slide">
            <div class="fs__content_slide__image">
              <img src="../../../../assets/img/tutorials/first-steps/step1/image1.png" alt="Welcome to Xcapit" />
            </div>
            <div class="fs__content_slide__primary_text">
              <app-ux-title>
                {{ 'tutorials.first_steps.step1.primary_text' | translate }}
              </app-ux-title>
            </div>
            <div class="fs__content_slide__secondary_text">
              <app-ux-text>
                {{ 'tutorials.first_steps.step1.secondary_text' | translate }}
              </app-ux-text>
            </div>
            <div class="fs__content_slide__slide_step_show">
              <app-ux-slide-step-show [step]="this.actualStep" [total]="this.sliderLength"></app-ux-slide-step-show>
            </div>

            <div class="fs__content_slide__button_next">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Ion Slide Next Button S1"
                size="large"
                expand="block"
                color="uxsecondary"
                (click)="this.slideNext()"
              >
                {{ 'tutorials.first_steps.step1.next_button' | translate }}
              </ion-button>
            </div>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="fs__content_slide">
            <div class="fs__content_slide__image">
              <img src="../../../../assets/img/tutorials/first-steps/step2/image2.png" alt="Mobile Banking" />
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
              <app-ux-slide-step-show [step]="this.actualStep" [total]="this.sliderLength"></app-ux-slide-step-show>
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
              <img src="../../../../assets/img/tutorials/first-steps/step3/image3.png" alt="Security" />
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
              <app-ux-slide-step-show [step]="this.actualStep" [total]="this.sliderLength"></app-ux-slide-step-show>
            </div>
            <div class="fs__content_slide__button_back">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Ion Slide Back Button S3"
                fill="clear"
                type="button"
                color="uxsecondary"
                (click)="this.slideBack()"
              >
                {{ 'tutorials.first_steps.step3.back_button' | translate }}
              </ion-button>
            </div>
            <div class="fs__content_slide__button_next">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Ion Slide Next Button S3"
                size="large"
                expand="block"
                color="uxsecondary"
                (click)="this.goToMenu()"
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
    private navController: NavController,
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
    this.navController.navigateForward(['profiles/user']);
  }

  goToMenu() {
    this.navController.navigateForward(['tabs/home']);
  }
}

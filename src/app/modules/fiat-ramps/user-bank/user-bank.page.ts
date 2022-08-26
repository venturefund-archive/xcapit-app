import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-user-bank',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.register.header_bank' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding rp">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <div>
            <ion-text class="ux-font-text-xs">
              {{ 'fiat_ramps.register.description_bank' | translate }}
            </ion-text>
          </div>
          <!-- CUIT/CUIL -->
          <app-ux-input
            controlName="cuit"
            type="text"
            inputmode="numeric"
            [label]="'fiat_ramps.register.cuil' | translate"
            [placeholder]="'fiat_ramps.register.cuil' | translate"
          ></app-ux-input>

          <!-- CBU/CVU -->
          <app-ux-input
            controlName="cbu_cvu"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.cbu' | translate"
            [placeholder]="'fiat_ramps.register.cbu' | translate"
            (keyup)="this.cbuCountFunc()"
            [maxlength]="22"
          ></app-ux-input>
          <div class="cbu-count">{{ this.cbuCount }} / 22</div>

          <!-- Banco -->
          <app-ux-input
            controlName="banco"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.bank' | translate"
            [placeholder]="'fiat_ramps.register.bank' | translate"
          ></app-ux-input>
        </div>

        <div class="ux_footer">
          <div class="button-next">
            <ion-button class="ux_button" appTrackClick name="Next" type="submit" color="secondary" size="large">
              {{ 'fiat_ramps.register.next' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
    <app-fixed-footer></app-fixed-footer>
  `,
  styleUrls: ['./user-bank.page.scss'],
})
export class UserBankPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    cuit: [
      '',
      [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern('[0-9][^.a-zA-Z]*$')],
    ],
    cbu_cvu: [
      '',
      [Validators.required, Validators.minLength(22), Validators.maxLength(22), Validators.pattern('[0-9]*$')],
    ],
    banco: ['', [Validators.required]],
  });

  cbuCount = 0;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private trackService: TrackService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.trackScreenViewEvent();
  }

  cbuCountFunc() {
    this.cbuCount = this.form.value.cbu_cvu.length;
  }

  async handleSubmit() {
    this.fiatRampsService.registerUserBank(this.form.value).subscribe({
      next: (res) => {
        this.navController.navigateForward(['fiat-ramps/user-images'], { replaceUrl: true });
      },
    });
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_screenview_bank',
    });
  }
}

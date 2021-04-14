import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-bank',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.register.header_bank' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding rp">
      <app-ux-text class="ion-padding-top ion-margin-top">
        <div class="ion-margin-top ion-margin-bottom" style="font-size: 16px;">
          {{ 'fiat_ramps.register.description_bank' | translate }}
        </div>
      </app-ux-text>

      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
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
            (keyup) = "this.cbu_count_func()"
            [maxlength] = "22"
          ></app-ux-input>
          <div class="cbu-count">
            {{this.cbu_count}} / 22
          </div>

          <!-- Banco -->
          <app-ux-input
            controlName="banco"
            type="text"
            inputmode="text"
            [label]="'fiat_ramps.register.bank' | translate"
            [placeholder]="'fiat_ramps.register.bank' | translate"
          ></app-ux-input>

          <div class="ux_footer">
            <div class="button-next">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Next"
                type="submit"
                color="uxsecondary"
                size="large"
              >
                {{ 'fiat_ramps.register.next' | translate }}
              </ion-button>
            </div>
          </div>
        </form>
    </ion-content>

  `,
  styleUrls: ['./user-bank.page.scss'],
})
export class UserBankPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    cuit: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    cbu_cvu: [
      '', 
      [
        Validators.required,
        Validators.minLength(22),
        Validators.maxLength(22),
        Validators.pattern('[0-9]*$')
      ]
    ],
    banco: ['', [Validators.required]]
  });

  cbu_count = 0;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  cbu_count_func() {
    this.cbu_count = this.form.value['cbu_cvu'].length;
  }

  async handleSubmit() {
    this.fiatRampsService.registerUserBank(this.form.value)
    .subscribe({
      next: (res) => {
        this.navController.navigateForward(['fiat-ramps/user-images']);
      }
    })
  }

}

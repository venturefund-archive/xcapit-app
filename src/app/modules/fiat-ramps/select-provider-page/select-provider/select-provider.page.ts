import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { PROVIDERS } from '../../shared-ramps/constants/providers';
@Component({
  selector: 'app-select-provider',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'fiat_ramps.select_provider.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ux_content">
          <form [formGroup]="this.form">
            <app-select-provider-card
              (route)="this.receiveRoute($event)"
              (onChange)="this.resetForm()"
              controlName="provider"
            ></app-select-provider-card>
          </form>
        </div>
        <div class="ux_footer ion-padding">
          <ion-button
            class="ux_button"
            appTrackClick
            name="ux_fiat_ramps_continue"
            color="secondary"
            size="large"
            expand="block"
            (click)="this.goToRoute()"
            [disabled]="!this.form.valid"
          >
            {{ 'fiat_ramps.select_provider.button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-provider.page.scss'],
})
export class SelectProviderPage {
  form: FormGroup = this.formBuilder.group({
    country: ['', [Validators.required]],
    provider: ['', [Validators.required]],
  });
  providers = PROVIDERS;
  route: string;
  disabled: boolean = true;
  disableButton: boolean = true;
  button;

  constructor(private navController: NavController, private formBuilder: FormBuilder) {}

  receiveRoute(route: string) {
    this.route = route;
  }

  goToRoute() {
    this.navController.navigateForward([this.route]);
  }

  resetForm() {
    this.form.get('provider').reset();
  }
}

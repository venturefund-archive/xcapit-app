import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { NavController } from '@ionic/angular';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';

@Component({
  selector: 'app-insert-key',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/success"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.insert_key.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <div class="ik__title">
            <app-ux-title>{{ 'apikeys.insert_key.title' | translate }}</app-ux-title>
          </div>
          <div class="ik__text_before">
            <app-ux-text>
              {{ 'apikeys.insert_key.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="ik__ak_input">
            <app-ux-input
              controlName="api_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.insert_key.insert_key' | translate"
              [placeholder]="'apikeys.insert_key.insert_key_placeholder' | translate"
            ></app-ux-input>
          </div>
        </div>
        <div class="ux_footer">
          <div class="ik__next_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Next"
              type="submit"
              color="uxsecondary"
              size="large"
              routerLink="/apikeys/insert-key"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'apikeys.insert_key.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./insert-key.page.scss'],
})
export class InsertKeyPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    api_key: ['', [Validators.required]],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private storageApikeysService: StorageApikeysService
  ) {}

  ngOnInit() {}

  handleSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      data.exchange = 'Binance';
      this.storageApikeysService.updateData(data);
      this.navController.navigateForward(['/apikeys/insert-secret']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}

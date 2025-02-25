import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-backup',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'profiles.backup.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="b ion-padding" [scrollY]="false">
      <form [formGroup]="this.form">
        <div class="b__title">
          <ion-text class="ux-font-text-lg">
            {{ 'profiles.backup.title' | translate }}
          </ion-text>
        </div>
        <div class="b__item">
          <ion-item lines="none" class="b__item__toggle ux-font-title-xs ion-no-padding">
            <div class="b__item__toggle__labels">
              <ion-text class="ux-font-text-xs">{{ 'profiles.backup.toggle_text' | translate }}</ion-text>
            </div>
            <ion-toggle
              formControlName="backup"
              name="ux_backup"
              class="b__item__toggle toggle ux-toggle ion-no-padding"
              mode="ios"
              slot="end"
              (click)="this.goToBackup()"
              [disabled]="this.alreadyHasBackup"
              [checked]="this.alreadyHasBackup"
            ></ion-toggle>
          </ion-item>
        </div>
      </form>
    </ion-content>`,
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    backup: [false, []],
  });
  alreadyHasBackup: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private ionicStorageService: IonicStorageService,
    private navController: NavController,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.checkToggleStatus();
  }

  goToBackup() {
    this.trackToggle();
    this.navController.navigateForward('/wallets/success-creation');
  }

  async checkToggleStatus() {
    this.alreadyHasBackup = await this.ionicStorageService.get('wallet_backup');
  }

  trackToggle() {
    this.trackService.trackEvent({
      eventAction: 'click',
      description: window.location.href,
      eventLabel: 'ux_gdrivebkup_toggle_on',
    });
  }
}

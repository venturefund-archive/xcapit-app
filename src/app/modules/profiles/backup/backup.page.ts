import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

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
              (click)="this.activateBackup()"
              [disabled]="this.alreadyHasBackup"
              [checked]="this.alreadyHasBackup"
            ></ion-toggle>
          </ion-item>
        </div>
        <ion-button (click)="this.mockStorageActivation()">Toggle storage state</ion-button>
        <ion-button (click)="this.mockStorageSet()">Set mockStorageSet</ion-button>
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
    private ionicStorageService: IonicStorageService,) {}

  ngOnInit() {
    this.checkToggleStatus();
  }

  activateBackup() {
    // if (!this.alreadyHasBackup){
      console.log('it works')
      // this.alreadyHasBackup = true;
    // }
  }

  async checkToggleStatus() {
    this.alreadyHasBackup = await this.ionicStorageService.get('wallet_backup')
  }

  async mockStorageActivation() {
    const key = await this.ionicStorageService.get('wallet_backup')
    if (key === true) {
      console.log('changing storage value to false...')
      this.ionicStorageService.set('wallet_backup', false)
    } else {
      console.log('changing storage value to true...')
      this.ionicStorageService.set('wallet_backup', true)
    }
    this.checkToggleStatus()
  }

  mockStorageSet() {
    this.ionicStorageService.set('wallet_backup', false)
  }
}

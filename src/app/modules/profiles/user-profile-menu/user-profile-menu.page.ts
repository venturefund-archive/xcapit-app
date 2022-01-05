import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { UxSelectModalComponent } from 'src/app/shared/components/ux-select-modal/ux-select-modal.component';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { ITEM_MENU } from '../shared-profiles/constants/item-menu';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { MenuCategory } from '../shared-profiles/interfaces/menu-category.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-profile-menu',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"> </ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.user_profile_menu.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="user-data ux-card ion-padding">
        <div class="user-img">
          <img src="assets/img/user-profile/avatar-user.svg" />
        </div>
        <div>
          <ion-text class="user-mail ux-font-header-titulo">{{ this.profile?.email }}</ion-text>
        </div>
      </div>
      <div class="card-item" *ngIf="this.itemMenu">
        <app-card-category-menu *ngFor="let category of this.itemMenu" [category]="category"></app-card-category-menu>
      </div>
      <div>
        <div class="ux-card">
          <div class="card-title">
            <img class="card-title__img" src="assets/ux-icons/ux-apikeys.svg" />
            <ion-text class="ux-font-header-titulo card-title__text">{{
              'profiles.user_profile_menu.category_preferences' | translate
            }}</ion-text>
          </div>
          <form class="toggle" *ngIf="this.profile" [formGroup]="this.form">
            <ion-text color="uxdark" class="ux-font-text-xs">{{
              'profiles.user_profile_menu.push_notifications' | translate
            }}</ion-text>
            <ion-toggle
              color="info"
              class="ux-toggle"
              name="Push Notifications"
              formControlName="notificationsEnabled"
            ></ion-toggle>
          </form>
          <div>
            <ion-button
              class="ux-font-text-xs"
              name="Change Language"
              fill="clear"
              appTrackClick
              (click)="this.changeLanguage()"
            >
              <ion-text color="uxdark">{{ 'profiles.user_profile_menu.language' | translate }}</ion-text></ion-button
            >
          </div>
        </div>
      </div>
      <ion-button
        class="menu-item ux-font-text-xs"
        name="Log Out"
        color="uxprimary"
        fill="clear"
        appTrackClick
        (click)="this.logout()"
        >{{ 'app.main_menu.logout' | translate }}
        <ion-icon color="uxprimary" slot="start" name="ux-logout-icon"></ion-icon>
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./user-profile-menu.page.scss'],
})
export class UserProfileMenuPage implements OnInit {
  profile: any;
  itemMenu: MenuCategory[] = ITEM_MENU;
  form: FormGroup = this.formBuilder.group({
    notificationsEnabled: [false, []],
  });
  constructor(
    private apiProfiles: ApiProfilesService,
    private authService: AuthService,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService,
    private language: LanguageService,
    private notificationsService: NotificationsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getProfile();
  }

  private subscribeToFormChanges() {
    this.form.controls.notificationsEnabled.valueChanges.subscribe(() => this.togglePushNotifications());
  }

  private getProfile() {
    this.apiProfiles.crud.get().subscribe((res) => {
      this.profile = res;
      this.patchNotificationsValue();
      this.subscribeToFormChanges();
    });
  }

  async logout() {
    await this.authService.logout();
    await this.navController.navigateRoot('users/login');
  }

  async changeLanguage() {
    const modal = await this.modalController.create({
      component: UxSelectModalComponent,
      componentProps: {
        title: this.translate.instant('app.main_menu.change_language'),
        data: this.language.getLanguages(),
        keyName: 'text',
        valueName: 'value',
        selected: this.language.selected,
      },
      cssClass: 'ux_modal_crm',
    });

    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.role === 'selected') {
      this.language.setLanguage(data.data);
    }
  }

  private patchNotificationsValue() {
    this.form.patchValue({ notificationsEnabled: this.profile.notifications_enabled });
  }

  togglePushNotifications() {
    this.notificationsService.toggle(!this.profile.notifications_enabled).subscribe(() => {
      this.profile.notifications_enabled = !this.profile.notifications_enabled;
    });
  }
}

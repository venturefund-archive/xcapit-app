import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { UxSelectModalComponent } from 'src/app/shared/components/ux-select-modal/ux-select-modal.component';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { ITEM_MENU } from '../shared-profiles/constants/item-menu';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';

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
          <ion-text class="user-mail ux-font-header-titulo">{{ this.data?.email }}</ion-text>
        </div>
      </div>
      <div class="card-item">
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
          <div>
            <div>
              <ion-button
                class="ux-font-text-xs"
                name="Change Language"
                fill="clear"
                color="uxsemidark"
                appTrackClick
                (click)="this.changeLanguage()"
                >{{ 'profiles.user_profile_menu.language' | translate }}</ion-button
              >
            </div>
          </div>
        </div>
      </div>
      <ion-button
        class="menu-item ux-font-text-xs"
        name="Log Out"
        color="uxsemidark"
        fill="clear"
        appTrackClick
        (click)="this.logout()"
        >{{ 'app.main_menu.logout' | translate }}
        <ion-icon slot="start" name="ux-logout-icon"></ion-icon>
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./user-profile-menu.page.scss'],
})
export class UserProfileMenuPage implements OnInit {
  data: any;
  itemMenu = ITEM_MENU;

  constructor(
    private apiProfiles: ApiProfilesService,
    private authService: AuthService,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService,
    private language: LanguageService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.apiProfiles.crud.get().subscribe((res) => {
      this.data = res;
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
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swiper, { SwiperOptions, Navigation } from 'swiper';
import { InvestorProfileService } from '../shared-wealth-managements/services/investor-profile/investor-profile.service';
Swiper.use([Navigation]);
@Component({
  selector: 'app-about-investor-profiles',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wealth-management/investor-test-options"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wealth_managements.about_investor_profile.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [scrollY]="false">
      <swiper [config]="config">
        <ng-template class="template" swiperSlide *ngFor="let profile of this.investorProfiles; let i = index">
          <app-investor-profile-step
            [actualStep]="i + 1"
            [id]="profile.id"
            [title]="profile.title"
            [subtitle]="profile.subtitle"
            [imagePath]="profile.imagePath"
            (setProfileEvent)="this.setProfile($event)"
          ></app-investor-profile-step>
        </ng-template>
      </swiper>
    </ion-content>
  `,
  styleUrls: ['./about-investor-profiles.page.scss'],
})
export class AboutInvestorProfilesPage implements OnInit {
  public config: SwiperOptions = {
    navigation: true,
  };

  investorProfiles = [
    {
      id: 1,
      title: 'wealth_managements.about_investor_profile.conservative_profile.title',
      subtitle: 'wealth_managements.about_investor_profile.conservative_profile.subtitle',
      imagePath: 'assets/img/investor-test/conservative.svg',
    },
    {
      id: 2,
      title: 'wealth_managements.about_investor_profile.moderated_profile.title',
      subtitle: 'wealth_managements.about_investor_profile.moderated_profile.subtitle',
      imagePath: 'assets/img/investor-test/moderated.svg',
    },
    {
      id: 3,
      title: 'wealth_managements.about_investor_profile.aggressive_profile.title',
      subtitle: 'wealth_managements.about_investor_profile.aggressive_profile.subtitle',
      imagePath: 'assets/img/investor-test/aggressive.svg',
    },
  ];

  constructor(private translate: TranslateService, private investorProfileService: InvestorProfileService) {}

  ngOnInit() {}

  setProfile(value) {
    this.investorProfileService.setProfile(value);
  }
}

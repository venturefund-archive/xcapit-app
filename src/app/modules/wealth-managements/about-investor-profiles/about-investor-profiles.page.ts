import { ApiProfilesService } from './../../profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions, Navigation } from 'swiper';
import { NavController } from '@ionic/angular';
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
            [baseScore]="profile.baseScore"
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
      title: 'wealth_managements.about_investor_profile.conservative_profile.title',
      subtitle: 'wealth_managements.about_investor_profile.conservative_profile.subtitle',
      imagePath: 'assets/img/investor-test/conservative.svg',
      baseScore: 1,
    },
    {
      title: 'wealth_managements.about_investor_profile.moderated_profile.title',
      subtitle: 'wealth_managements.about_investor_profile.moderated_profile.subtitle',
      imagePath: 'assets/img/investor-test/moderated.svg',
      baseScore: 8,
    },
    {
      title: 'wealth_managements.about_investor_profile.aggressive_profile.title',
      subtitle: 'wealth_managements.about_investor_profile.aggressive_profile.subtitle',
      imagePath: 'assets/img/investor-test/aggressive.svg',
      baseScore: 14,
    },
  ];

  constructor(private apiProfilesService: ApiProfilesService,
    private navController: NavController) {}

  ngOnInit() {}

  setProfile(score) {
    this.apiProfilesService.crud.patch({ investor_score: score }).subscribe(() => {
      this.navController.navigateForward(['/tabs/investments/defi/options']);
    });
  }
}

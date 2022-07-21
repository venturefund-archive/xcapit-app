import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-error-test',
  template: `<ion-content class="ion-padding">
    <app-success-content *ngIf="this.data" [data]="this.data"></app-success-content>
  </ion-content>`,
  styleUrls: ['./error-test.page.scss'],
})
export class ErrorTestPage implements OnInit {
  data = SUCCESS_TYPES.error_test_financial_education;
  constructor(
    private trackService: TrackService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.trackScreenView();
  }

  getParams() {
    const category = this.route.snapshot.paramMap.get('category');
    const moduleId = parseInt(this.route.snapshot.paramMap.get('module'));
    const submoduleId = parseInt(this.route.snapshot.paramMap.get('submodule'));
    const code = this.route.snapshot.paramMap.get('code');
  }

  goToStartTest() {
    this.navController.navigateForward([
      'financial-education/typeform/tab',
      this.selectedTab,
      'module',
      this.module.id,
      'submodule',
      this.subModule.id,
      'code',
      this.subModule.test_code,
    ]);
  }

  goToLearnMore() {
    this.navController.navigateForward([
      '/tabs/financial-education/information/tab/',
      this.selectedTab,
      'module',
      this.module.id,
      'submodule',
      this.subModule.id,
    ]);
  }

  trackScreenView() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_education_screenview_retry',
    });
  }
}

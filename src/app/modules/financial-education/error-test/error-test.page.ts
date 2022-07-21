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
  category: string;
  moduleId;
  submoduleId;
  code;

  constructor(private trackService: TrackService, private route: ActivatedRoute) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.trackScreenView();
    this.getParams();
    this.setURLs();
  }

  trackScreenView() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_education_screenview_retry',
    });
  }

  getParams() {
    this.category = this.route.snapshot.paramMap.get('category');
    this.moduleId = parseInt(this.route.snapshot.paramMap.get('module'));
    this.submoduleId = parseInt(this.route.snapshot.paramMap.get('submodule'));
    this.code = this.route.snapshot.paramMap.get('code');
  }

  setURLs() {
    this.data.urlPrimaryAction = `financial-education/typeform/category/${this.category}/module/${this.moduleId}/submodule/${this.submoduleId}/code/${this.code}`;
    this.data.urlThirdAction = `financial-education/typeform/category/${this.category}/module/${this.moduleId}/submodule/${this.submoduleId}`;
  }
}

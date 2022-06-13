import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-final-success-test',
  template: ` <ion-header>
  <ion-toolbar color="white" class="no-border ion-padding">
  <app-share-education [lightBackground]="this.lightBackground"></app-share-education>
  </ion-toolbar>
</ion-header>
  <ion-content class="ion-padding">
  <app-success-content *ngIf="this.data" [data]="this.data"></app-success-content>
</ion-content>`,
  styleUrls: ['./final-success-test.page.scss'],
})
export class FinalSuccessTestPage implements OnInit {
  data = SUCCESS_TYPES.final_success_test;
  lightBackground= true;
  constructor(private trackService : TrackService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
   this.trackScreenView();
  }

  trackScreenView(){
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_education_all_modules_complete'
    });
  }
}

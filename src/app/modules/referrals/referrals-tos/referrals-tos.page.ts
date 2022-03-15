import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-referrals-tos',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/referrals/summary"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'referrals.referrals_tos.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="rt ion-padding">
      <ion-text class="rt__title ux-font-header-titulo">
        {{ 'referrals.referrals_tos.title' | translate }}
      </ion-text>
      <ion-text
        class="rt__paragraph first ux-font-text-base"
        [innerHTML]="'referrals.referrals_tos.paragraph' | translate"
      ></ion-text>
      <div *ngFor="let paragraph of this.paragraphs">
        <ion-text class="rt__subtitle ux-font-header-titulo">{{
          'referrals.referrals_tos.subtitle_' + paragraph | translate
        }}</ion-text>
        <ion-text class="rt__paragraph ux-font-text-base">{{
          'referrals.referrals_tos.paragraph_' + paragraph | translate
        }}</ion-text>
      </div>
    </ion-content>
  `,
  styleUrls: ['./referrals-tos.page.scss'],
})
export class ReferralsTosPage implements AfterViewInit {
  paragraphs = Array.from({ length: 10 }, (_, i) => i + 1);
  anchors: any;
  constructor(private elementRef: ElementRef, private navController: NavController) {}

  ngAfterViewInit() {
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('click', this.handleAnchorClick.bind(this));
    });
  }

  handleAnchorClick(event: Event) {
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this.navController.navigateForward(anchor.getAttribute('href')).then();
  }
}

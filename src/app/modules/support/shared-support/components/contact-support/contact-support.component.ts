import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Component({
  selector: 'app-contact-support',
  template: ` <div class="csc" (click)="this.goToWriteTicket()">
    <div class="csc__content ux-card">
      <div class="csc__content__icon">
        <img src="../../assets/ux-icons/ux-support.svg" />
      </div>
      <div class="csc__content__body">
        <div class="csc__content__body__title">
          <div class="ux-font-text-lg">
            <ion-text class="title"> {{ 'support.contact_support.title' | translate }}</ion-text>
          </div>
        </div>
      </div>
      <div class="csc__button">
        <div class="button">
          <ion-button appTrackClick name="Go To Create Ticket" fill="clear" size="small" slot="end">
            <ion-icon slot="end" name="chevron-forward-outline" class="chevron"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./contact-support.component.scss'],
})
export class ContactSupportComponent implements OnInit {
  constructor(private navController: NavController, private remoteConfigService: RemoteConfigService) {}

  ngOnInit() {}
  goToWriteTicket() {
    let route = '/tickets/create-support-ticket';
    if (this.remoteConfigService.getFeatureFlag('ff_newLogin')) {
      route = '/tickets/new-create-support-ticket';
    }
    this.navController.navigateForward(route);
  }
}

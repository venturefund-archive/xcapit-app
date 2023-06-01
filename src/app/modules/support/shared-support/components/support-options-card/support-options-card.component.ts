import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

@Component({
  selector: 'app-support-options-card',
  template: ` <div class="soc" (click)="this.goToOption()">
    <div class="soc__content ux-card">
      <div class="soc__content__icon">
        <img [src]="this.option.icon" />
      </div>
      <div class="soc__content__body">
        <div class="soc__content__body__title">
          <div class="ux-font-text-lg">
            <ion-text class="title"> {{ this.option.title | translate }}</ion-text>
          </div>
        </div>
        <div class="soc__content__body__description">
          <div class="ux-font-text-xxs">
            <ion-text class="description"> {{ this.option.description | translate }}</ion-text>
          </div>
        </div>
      </div>
      <div class="soc__button">
        <div class="button">
          <ion-button appTrackClick name="Select" fill="clear" size="small" slot="end">
            <ion-icon slot="end" name="chevron-forward-outline" class="chevron"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./support-options-card.component.scss'],
})
export class SupportOptionsCardComponent implements OnInit {
  @Input() option: any;

  constructor(private navController: NavController, private browserService: BrowserService) {}

  ngOnInit() {}

  goToOption() {
    this.option.route.includes('https')
      ? this.openBrowser(this.option.route)
      : this.navController.navigateForward(this.option.route).then();
  }

  async openBrowser(link) {
    await this.browserService.open({ url: link });
  }
}

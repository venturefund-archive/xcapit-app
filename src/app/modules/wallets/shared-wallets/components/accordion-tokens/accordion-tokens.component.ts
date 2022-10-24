import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { TokenDetail } from '../../models/token-detail/token-detail';

@Component({
  selector: 'app-accordion-tokens',
  template: `
    <div class="at">
      <div class="at__content">
        <div class="at__accordeon">
          <ion-list show="true" slot="content">
            <app-ux-list-inverted>
              <ion-list>
                <div class="at__loader" *ngIf="!firstTokenDetails">
                  <app-ux-loading-block minSize="30px"></app-ux-loading-block>
                </div>
                <div class="container">
                  <app-wallet-balance-card-item
                    *ngFor="let tokenDetail of this.firstTokenDetails; let last = last"
                    [tokenDetail]="tokenDetail"
                    [last]="last"
                  >
                  </app-wallet-balance-card-item>
                </div>
                <ion-accordion-group>
                  <ion-accordion toggleIcon="" class="accordion" value="coins">
                    <div slot="content" class="container">
                      <app-wallet-balance-card-item
                        *ngFor="let tokenDetail of this.remainingTokenDetails; let last = last"
                        [tokenDetail]="tokenDetail"
                        [last]="last"
                      >
                      </app-wallet-balance-card-item>
                    </div>
                  </ion-accordion>
                </ion-accordion-group>
              </ion-list>
            </app-ux-list-inverted>
          </ion-list>
        </div>
      </div>
      <div class="at__button" *ngIf="this.remainingTokenDetails && !this.lessThanFourTokens">
        <ion-button
          *ngIf="!this.openedAccordion && this.remainingTokenDetails.length > 0"
          name="Open Accordion"
          class="link ux-link-xs"
          appTrackClick
          fill="clear"
          size="small"
          (click)="openAccordion()"
        >
          {{ 'wallets.shared_wallets.accordion_token.expand_button' | translate }}
        </ion-button>
        <ion-button
          *ngIf="this.openedAccordion"
          name="Close Accordion"
          class="link ux-link-xs"
          appTrackClick
          fill="clear"
          size="small"
          (click)="closeAccordion()"
        >
          {{ 'wallets.shared_wallets.accordion_token.reduce_button' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./accordion-tokens.component.scss'],
})
export class AccordionTokensComponent implements OnInit, OnChanges {
  @Input() tokenDetails: TokenDetail[];
  firstTokenDetails: TokenDetail[];
  remainingTokenDetails: TokenDetail[];
  lessThanFourTokens: boolean;
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  openedAccordion: boolean;

  constructor() {}

  ngOnInit() {
    this.accordionGroup.value = '';
    this.separateFilteredData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.tokenDetails = changes.tokenDetails.currentValue;
    this.separateFilteredData();
  }

  openAccordion() {
    this.accordionGroup.value = 'coins';
    this.openedAccordion = true;
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
    this.openedAccordion = false;
  }

  separateFilteredData() {
    this.lessThanFourTokens = this.tokenDetails.length <= 4 ? true : false;
    this.firstTokenDetails = this.tokenDetails?.slice(0, 4);
    this.remainingTokenDetails = this.tokenDetails?.slice(4, this.tokenDetails.length);
  }
}

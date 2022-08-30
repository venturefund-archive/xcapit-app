import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

@Component({
  selector: 'app-investment-history',
  template: `<div class="qc">
    <div class="qc__content">
      <div class="qc__accordeon">
        <ion-list show="true" slot="content">
          <app-ux-list-inverted>
            <ion-list>
              <div class="qc__loader" *ngIf="!firstMovements">
                <app-ux-loading-block minSize="30px"></app-ux-loading-block>
              </div>
              <div class="container">
                <app-item-investment-history
                  *ngFor="let movement of this.firstMovements; let last = last"
                  [movement]="movement"
                  [token]="this.token"
                ></app-item-investment-history>
              </div>
              <ion-accordion-group>
                <ion-accordion toggleIcon="" class="accordion" value="movements">
                  <div slot="content" class="container">
                    <app-item-investment-history
                      *ngFor="let movement of this.remainingMovements; let last = last"
                      [movement]="movement"
                      [token]="this.token"
                      [last]="last"
                    ></app-item-investment-history>
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ion-list>
          </app-ux-list-inverted>
        </ion-list>
      </div>
    </div>
    <div class="qc__button" *ngIf="this.remainingMovements">
      <ion-button
        *ngIf="!this.openedAccordion && this.remainingMovements.length > 0"
        name="Open Accordion"
        class="link ux-link-xs"
        appTrackClick
        fill="clear"
        size="small"
        (click)="openAccordion()"
      >
        {{ 'home.home_page.quotes_card.more_button' | translate }}
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
        {{ 'home.home_page.quotes_card.less_button' | translate }}
      </ion-button>
    </div>
  </div>`,
  styleUrls: ['./investment-history.component.scss'],
})
export class InvestmentHistoryComponent implements OnInit {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  @Input() firstMovements;
  @Input() remainingMovements;
  @Input() token: Coin;
  openedAccordion: boolean;

  constructor() {}

  ngOnInit() {
    this.accordionGroup.value = '';
  }

  openAccordion() {
    this.accordionGroup.value = 'movements';
    this.openedAccordion = true;
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
    this.openedAccordion = false;
  }
}

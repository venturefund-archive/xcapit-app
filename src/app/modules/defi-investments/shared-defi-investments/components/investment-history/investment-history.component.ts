import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investment-history',
  template: `<div class="qc">
    <div class="qc__content">
      <div class="qc__accordeon">
        <ion-list show="true" slot="content">
          <app-ux-list-inverted>
            <ion-list>
              <div class="loader" *ngIf="this.waitingQuotes">
                <app-ux-loading-block minSize="30px"></app-ux-loading-block>
              </div>
              <div class="container">
                <app-item-quote
                  *ngFor="let quote of this.firstQuotes; let last = last"
                  [quotation]="quote"
                ></app-item-quote>
              </div>
              <ion-accordion-group>
                <ion-accordion toggleIcon="" class="accordion" value="quotes">
                  <div slot="content" class="container">
                    <app-item-quote
                      *ngFor="let quote of this.remainingQuotes; let last = last"
                      [quotation]="quote"
                      [last]="last"
                    ></app-item-quote>
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ion-list>
          </app-ux-list-inverted>
        </ion-list>
      </div>
    </div>
    <div class="qc__button">
      <ion-button
        *ngIf="!this.openedAccordion"
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
  openedAccordion;
  waitingQuotes;
  firstQuotes;
  remainingQuotes;
  
  constructor() {}

  ngOnInit() {}

  openAccordion() {}

  closeAccordion() {}
}

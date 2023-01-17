import { Component } from '@angular/core';

@Component({
  selector: 'app-wallet-transaction-skeleton-card',
  template: `
    <div class="wtsc">
      <ion-list class="wtsc__list">
        <div *ngFor="let i of [1, 2, 3]" class="wtsc__list__item">
          <div class="wtsc__list__item__image">
            <ion-skeleton-text animated class="wtsc__list__item__image__round"></ion-skeleton-text>
          </div>

          <div class="wtsc__list__item__content">
            <ion-skeleton-text animated class="wtsc__list__item__content__upper"></ion-skeleton-text>
            <ion-skeleton-text animated class="wtsc__list__item__content__lower"></ion-skeleton-text>
          </div>
        </div>
      </ion-list>
    </div>
  `,
  styleUrls: ['./wallet-transaction-skeleton-card.component.scss'],
})
export class WalletTransactionSkeletonCardComponent {}

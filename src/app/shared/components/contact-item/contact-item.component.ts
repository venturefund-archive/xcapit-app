import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-item',
  template: `
    <div class="ci">
      <img *ngIf="this.showWalletImg" class="ci__img" src="/assets/img/contacts/wallet.svg" />
      <div class="ci__data">
        <div class="ci__data__title">
          <ion-text
            [ngClass]="this.boldName ? 'ux-font-text-lg' : 'ux-font-text-base'"
            [class.ci__data__title__neutral]="!this.boldName"
            >{{ name }}</ion-text
          >
          <app-token-network-badge
            *ngIf="networks.length === 1"
            [blockchainName]="networks[0]"
          ></app-token-network-badge>
        </div>
        <div class="ci__data__networks" *ngIf="networks.length > 1">
          <app-token-network-badge
            *ngFor="let network of networks"
            [blockchainName]="network"
          ></app-token-network-badge>
        </div>
        <div class="ci__data__subtitle" [ngStyle]="{ 'margin-top.px': this.boldName ? 8 : 4 }">
          <ion-text class="ux-font-text-xs">{{ address }}</ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./contact-item.component.scss'],
})
export class ContactItemComponent {
  @Input() name: string;
  @Input() address: string;
  @Input() networks: string[];
  @Input() showWalletImg: boolean = true;
  @Input() boldName: boolean = true;
  constructor() {}

}

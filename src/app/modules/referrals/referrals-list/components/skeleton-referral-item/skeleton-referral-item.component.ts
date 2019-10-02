import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-referral-item',
  template: `
    <ion-item>
      <ion-label><ion-skeleton-text animated style="width: 100%"></ion-skeleton-text></ion-label>
      <div
        slot="end"
        style="margin-left:3px"
        style="width: 20%; max-width:100px;"
        ><ion-skeleton-text animated style="width:100%;"></ion-skeleton-text></div
      >
    </ion-item>
  `,
  styleUrls: ['./skeleton-referral-item.component.scss']
})
export class SkeletonReferralItemComponent {
  constructor() {}
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-referral-detail',
  template: `
    <div class="rd">
      <div>
        <ion-text class="rd__title ux-font-num-titulo-xs">{{ this.title }}</ion-text>
        <br />
        <ion-text class="rd__subtitle ux-font-text-xxs">{{ this.subtitle }}</ion-text>
      </div>
      <div>
        <ion-text class="rd__quantity ux-font-text-xxs">{{ this.quantity }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./referral-detail.component.scss'],
})
export class ReferralDetailComponent implements OnInit {
  @Input() quantity: number;
  @Input() reward: number;
  @Input() title: string;
  @Input() subtitle: string;
  constructor() {}

  ngOnInit() {}
}
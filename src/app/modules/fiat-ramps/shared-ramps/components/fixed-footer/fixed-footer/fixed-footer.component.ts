import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fixed-footer',
  template: `
    <ion-footer class="ff">
      <ion-text class="ff__text ux-font-text-xs">{{ 'fiat_ramps.shared.fixed_footer.text' | translate }}</ion-text>
    </ion-footer>
  `,
  styleUrls: ['./fixed-footer.component.scss'],
})
export class FixedFooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

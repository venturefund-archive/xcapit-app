import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

@Component({
  selector: 'app-one-inch-tos-check',
  template: `<div class="tacc__checkbox">
    <ion-item class="tacc__checkbox__last ux-font-text-xs" [ngClass]="{'tacc__checkbox__last__grey':!this.showCheck}">
      <ion-checkbox
        mode="md"
        slot="start"
        name="checkbox-condition"
        [disabled]="this.disabled"
        [checked]="this.acceptTos"
        *ngIf="this.showCheck"
        (ionChange)="this.updateState($event)"
      >
      </ion-checkbox>
      <ion-label class="tacc__checkbox__phrase checkbox-link">
        <ion-label class="ux-font-text-xs"> {{ 'swaps.terms_and_conditions.terms.i_have_read' | translate }}</ion-label>
        <div class="tacc__checkbox__phrase__link">
          <ion-button
            name="go_to_1inch_tos"
            class="ux-link-xs tacc__checkbox__phrase__link__button"
            (click)="this.openTOS()"
            appTrackClick
            fill="clear"
          >
            {{ 'swaps.terms_and_conditions.terms.link_to_terms' | translate }}
          </ion-button>
          <ion-label class="ux-font-text-xs tacc__checkbox__phrase__link__label">{{
            'swaps.terms_and_conditions.terms.of' | translate
          }}</ion-label>
        </div>
      </ion-label>
    </ion-item>
  </div>`,
  styleUrls: ['./one-inch-tos-check.component.scss'],
})
export class OneInchTosCheckComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() showCheck: boolean;
  @Output() toggledCheckbox: EventEmitter<boolean> = new EventEmitter<boolean>();

  links = LINKS;
  acceptTos = false;
  key = 'termsAndConditions1InchSwapAccepted';

  constructor(private browserService: BrowserService) {}

  ngOnInit() {
  }

  async updateState(checkboxState: any) {
    this.toggledCheckbox.emit(checkboxState.detail.checked);
  }

  openTOS(): void {
    this.browserService.open({ url: this.links.oneInchToS });
  }
}

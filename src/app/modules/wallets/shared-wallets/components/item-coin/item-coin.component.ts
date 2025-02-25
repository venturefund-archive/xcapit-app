import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-item-coin',
  template: `
    <div [formGroupName]="this.network">
      <ion-item class="ic__item ion-no-padding ion-no-margin" [lines]="this.isLast ? 'none' : 'full'" [ngClass]="this.isLast ? 'last' : ''">
        <ion-img class="ic__img" [src]="this.coin.logoRoute"></ion-img>
        <div>
          <ion-label class="ic__label">{{ this.coin.name }}</ion-label>
          <ion-badge *ngIf="this.coin.native" class="ic__badge ux-badge-native" slot="end">{{
            'wallets.select_coin.native' | translate
          }}</ion-badge>
        </div>
        <ion-toggle
          (ionChange)="this.onChange($event)"
          [formControlName]="this.coin.value"
          [value]="this.coin"
          [checked]="this.isChecked"
          class="ic__toggle"
          mode="ios"
          slot="end"
        ></ion-toggle>
      </ion-item>
    </div>
  `,
  styleUrls: ['./item-coin.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ItemCoinComponent implements OnInit {
  @Input() coin: any;
  @Input() isChecked: boolean;
  @Input() network = '';
  @Input() isLast: boolean;
  @Output() changed: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onChange(event: any) {
    this.changed.emit(event);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-item-coin',
  template: `
    <div [formGroupName]="this.network">
      <ion-item>
        <ion-img class="ic__img" [src]="this.coin.logoRoute"></ion-img>
        <div>
          <ion-label class="ic__label">{{ this.coin.name }}</ion-label>
          <ion-badge *ngIf="this.coin.native" class="ic__badge ux_badge_native" slot="end">{{
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
      <div *ngIf="this.coin.last === false" class="list-divider"></div>
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
  @Output() changed: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onChange(event: any) {
    this.changed.emit(event);
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Coin } from '../../interfaces/coin.interface';

@Component({
  selector: 'app-items-coin-group',
  template: `
    <app-ux-radio-group>
      <ion-list class="list">
        <ion-radio-group>
          <div class="container">
            <ion-item class="icg__item ion-no-padding ion-no-margin" lines="full">
              <ion-label class="icg__label ux-font-text-xs">{{
                'wallets.select_coin.suite' | translate: { suiteName: (this.network | suite) }
              }}</ion-label>
              <ion-toggle
                name="AllToggle"
                class="icg__toggle"
                [checked]="this.allChecked"
                (click)="toggleAll($event)"
                mode="ios"
                slot="end"
              ></ion-toggle>
            </ion-item>
            <div class="list-divider"></div>
            <app-item-coin
              [network]="this.network"
              (changed)="this.validate($event)"
              [isChecked]="this.form.value.coin"
              *ngFor="let coin of coins; let last = last"
              [coin]="coin"
              [isLast]="last"
            ></app-item-coin>
          </div>
        </ion-radio-group>
      </ion-list>
    </app-ux-radio-group>
  `,
  styleUrls: ['./items-coin-group.component.scss'],
})
export class ItemsCoinGroupComponent implements OnInit {
  mode: string;
  @Input() coins: Coin[];
  @Input() network: string;
  @Output() changed = new EventEmitter<any>();
  form: FormGroup;

  constructor(private formGroup: FormGroupDirective) {}
  allChecked = false;

  ngOnInit() {
    this.form = this.formGroup.form;

    this.setToggleAllState();
  }

  validate(event) {
    this.changed.emit(event);
    this.checkIfNativeCoinFromNetworkIsChecked(event);
    this.setToggleAllState();
  }

  setToggleAllState() {
    this.allChecked = this.allToggled();
  }

  allToggled(): boolean {
    return Object.values(this.form.value[this.network]).every(Boolean);
  }

  toggleAll(event: any) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    this.allToggled() ? this.selectAll(false) : this.selectAll(true);
    this.setToggleAllState();
    this.changed.emit(event);
  }

  selectAll(select: boolean) {
    const allCoins = {};
    Object.keys(this.form.value[this.network]).forEach((coin) => {
      allCoins[coin] = select;
    });
    this.form.patchValue({ [this.network]: allCoins });
  }

  checkIfNativeCoinFromNetworkIsChecked(event: any) {
    const toggledCoin = event.detail.value;
    const isToggledCoinChecking = event.detail.checked;
    const nativeCoin = this.coins.find((coin) => coin.network === toggledCoin.network && coin.native === true).value;

    if (toggledCoin.native && !isToggledCoinChecking) {
      this.deselectAllNetworkCoins(toggledCoin.network);
    }
    if (!toggledCoin.native && isToggledCoinChecking) {
      this.checkNativeCoin(nativeCoin);
    }
  }

  deselectAllNetworkCoins(network: string) {
    const allMappedNetworkCoins = {};
    const allNetworkCoins = this.coins.filter((coin) => coin.network === network);
    allNetworkCoins.forEach((coin) => {
      allMappedNetworkCoins[coin.value] = false;
    });
    this.form.patchValue({ [this.network]: allMappedNetworkCoins });
  }

  checkNativeCoin(nativeCoin) {
    this.form.patchValue({ [this.network]: { [nativeCoin]: true } });
  }
}

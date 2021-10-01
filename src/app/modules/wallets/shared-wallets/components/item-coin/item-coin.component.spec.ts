import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { COINS } from '../../../constants/coins';

import { ItemCoinComponent } from './item-coin.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

const testCoin = {
  id: 1,
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  rpc: 'http://testrpc.test/',
  native: true,
};
describe('ItemCoinComponent', () => {
  let component: ItemCoinComponent;
  let fixture: ComponentFixture<ItemCoinComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemCoinComponent],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemCoinComponent);
      component = fixture.componentInstance;
      component.coin = COINS[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on change', () => {
    const spy = spyOn(component.change, 'emit');
    fixture.debugElement
      .query(By.css('ion-toggle'))
      .triggerEventHandler('ionChange', { detail: { checked: true, value: testCoin } });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { COINS } from '../../constants/coins';

import { ItemCoinComponent } from './item-coin.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
    component.onChange();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

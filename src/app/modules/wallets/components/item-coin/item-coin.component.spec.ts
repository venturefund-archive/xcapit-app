import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { COINS } from '../../constants/coins';

import { ItemCoinComponent } from './item-coin.component';

describe('ItemCoinComponent', () => {
  let component: ItemCoinComponent;
  let fixture: ComponentFixture<ItemCoinComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemCoinComponent],
        imports: [IonicModule.forRoot()],
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
});

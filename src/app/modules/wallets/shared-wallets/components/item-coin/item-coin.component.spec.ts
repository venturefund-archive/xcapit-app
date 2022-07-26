import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ItemCoinComponent } from './item-coin.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { NONPROD_COINS } from '../../constants/coins.nonprod';

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
  let formGroupDirectiveMock: any;
  let controlContainerMock: UntypedFormGroup;

  beforeEach(
    waitForAsync(() => {
      controlContainerMock = new UntypedFormBuilder().group({
        ETH: new UntypedFormBuilder().group({
          ETH: [false],
          LINK: [false],
          USDT: [false],
          AAVE: [false],
          UNI: [false],
        }),
      });
      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;

      TestBed.configureTestingModule({
        declarations: [ItemCoinComponent],
        imports: [IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemCoinComponent);
      component = fixture.componentInstance;
      component.network = 'ETH';
      component.coin = NONPROD_COINS[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on change', () => {
    const spy = spyOn(component.changed, 'emit');
    const targetEl = fixture.debugElement.query(By.css('ion-toggle')).nativeElement;
    const customEvent = new CustomEvent('ionChange', { detail: { checked: true, value: testCoin } });
    targetEl.dispatchEvent(customEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

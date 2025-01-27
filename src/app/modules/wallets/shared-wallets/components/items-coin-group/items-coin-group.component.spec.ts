import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { SuitePipe } from '../../../../../shared/pipes/suite/suite.pipe';

import { ItemsCoinGroupComponent } from './items-coin-group.component';
const testCoins = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 2,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    decimals: 18,
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
    decimals: 6,
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: false,
    value: 'UNI',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0xf2e3c830C6220795C6e101492BD1b98fb122AC01',
    decimals: 18,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    native: true,
  },
  {
    id: 7,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: false,
    value: 'RIF',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    decimals: 18,
  },
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.svg',
    last: true,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

const testNativeCoins = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    native: true,
  },
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.svg',
    last: true,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

describe('ItemsCoinGroupComponent', () => {
  let component: ItemsCoinGroupComponent;
  let fixture: ComponentFixture<ItemsCoinGroupComponent>;
  let formGroupDirectiveMock: any;
  let controlContainerMock: UntypedFormGroup;

  beforeEach(waitForAsync(() => {
    controlContainerMock = new UntypedFormBuilder().group({
      ETH: new UntypedFormBuilder().group({
        ETH: [false],
        LINK: [false],
        USDT: [false],
        AAVE: [false],
        UNI: [false],
      }),
      RSK: new UntypedFormBuilder().group({
        RBTC: [false],
        RIF: [false],
      }),
      POLYGON: new UntypedFormBuilder().group({
        MATIC: [false],
      }),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [ItemsCoinGroupComponent, SuitePipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
      providers: [TrackClickDirective, { provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsCoinGroupComponent);
    component = fixture.componentInstance;
    component.coins = testCoins;
    component.network = 'ETH';
    component.natives = testNativeCoins;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select native token of the network (ETH) when LINK is selected', async () => {
    component.form.patchValue({ ETH: { LINK: true } });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('changed', { detail: { checked: true, value: testCoins[1] } });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.ETH.ETH).toBeTrue();
  });

  it('should only select the token itself when a native token is selected', async () => {
    component.form.patchValue({ ETH: { ETH: true } });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('changed', { detail: { checked: true, value: testCoins[0] } });
    fixture.detectChanges();
    expect(component.form.value.ETH.ETH).toBeTrue();
    expect(Object.values(component.form.value.ETH).filter((value) => value === true).length).toEqual(1);
  });

  it('should deselect all tokens of the same network when a native token is deselected', () => {
    component.form.patchValue({ ETH: { LINK: true, USDT: true } });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('changed', { detail: { checked: false, value: testCoins[0] } });
    fixture.detectChanges();
    expect(component.form.value.ETH.LINK).toBeFalse();
    expect(component.form.value.ETH.USDT).toBeFalse();
  });

  it('should select all tokens when the "ETH Suite" toggle is clicked and not all token are selected already', () => {
    fixture.debugElement.query(By.css('ion-toggle[name="AllToggle"]')).nativeElement.click();
    fixture.detectChanges();
    expect(Object.values(component.form.value.ETH).filter((value) => value === true).length).toEqual(5);
  });

  it('should deselect all tokens when the "ETH suite" toggle is clicked and all token are selected', () => {
    component.form.patchValue({ ETH: { LINK: true, USDT: true, ETH: true, AAVE: true, UNI: true } });
    fixture.debugElement.query(By.css('ion-toggle[name="AllToggle"]')).nativeElement.click();
    fixture.detectChanges();
    expect(Object.values(component.form.value).filter((value) => value === true).length).toEqual(0);
  });

  it('should check if all tokens were selected on ngOnInit', () => {
    const spy = spyOn(component, 'setToggleAllState');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit changed event on validate', () => {
    const spy = spyOn(component.changed, 'emit');
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('changed', { detail: { checked: false, value: testCoins[0] } });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit changed event on toggleAll', () => {
    const spy = spyOn(component.changed, 'emit');
    component.toggleAll(new Event('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

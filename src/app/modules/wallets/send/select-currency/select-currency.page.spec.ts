import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SelectCurrencyPage } from './select-currency.page';
import { UxListCardComponent } from '../../../../shared/components/ux-list-card/ux-list-card.component';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';
import { navControllerMock } from '../../../../../testing/spies/nav-controller-mock.spec';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from '../../../../shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const coins: Coin[] = [
  {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
    network: '',
    rpc: '',
  },
  {
    id: 2,
    name: 'USDT - Tether',
    logoRoute: '../../assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: '',
    rpc: '',
  },
];

const coinClicked = {
  id: 1,
  name: 'BTC - Bitcoin',
  logoRoute: '../../assets/img/coins/BTC.svg',
  last: false,
  value: 'BTC',
};

describe('SelectCurrencyPage', () => {
  let component: SelectCurrencyPage;
  let fixture: ComponentFixture<SelectCurrencyPage>;
  let navController: NavController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectCurrencyPage, TrackClickDirective, UxListCardComponent],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [TrackClickDirective, { provide: NavController, useValue: navControllerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCurrencyPage);
    component = fixture.componentInstance;
    component.coins = coins;
    fixture.detectChanges();
    navController = TestBed.inject(NavController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of coins', () => {
    const list = fixture.debugElement.query(By.css('app-ux-list-card'));
    expect(list.nativeElement.innerText).toContain('BTC - Bitcoin');
    expect(list.nativeElement.innerText).toContain('USDT - Tether');
  });

  it('should navigate when itemClicked event fired', () => {
    const spy = spyOn(navController, 'navigateForward').and.callThrough();
    const list = fixture.debugElement.query(By.css('app-ux-list-card'));
    list.triggerEventHandler('itemClicked', coinClicked);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/wallets/send/detail', 'BTC']);
  });
});

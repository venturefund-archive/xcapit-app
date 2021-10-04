import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SendDetailPage } from './send-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { navControllerMock } from '../../../../../testing/spies/nav-controller-mock.spec';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { FakeTrackClickDirective } from '../../../../../testing/fakes/track-click-directive.fake.spec';

const coins: Coin[] = [
  {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
    network: 'BTC',
    rpc: '',
  },
];

const formData = {
  valid: {
    address: 'asdfasdfasdfas',
    amount: '29',
    referenceAmount: '29',
  },
};

describe('SendDetailPage', () => {
  let component: SendDetailPage;
  let fixture: ComponentFixture<SendDetailPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendDetailPage>;
  let activatedRouteMock: any;
  let navControllerSpy: any;

  beforeEach(() => {
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => 'BTC',
        },
      },
    };
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      declarations: [SendDetailPage, FakeTrackClickDirective],
      imports: [
        IonicModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendDetailPage);
    component = fixture.componentInstance;
    component.coins = coins;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find currency and networks on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.networks).toEqual([coins[0].network]);
    expect(component.selectedNetwork).toEqual(coins[0].network);
    expect(component.currency).toEqual(coins[0]);
  });

  it('should change selected network on event emited', () => {
    component.networks = ['ERC20', 'BTC'];
    component.selectedNetwork = 'ERC20';
    fixture.detectChanges();
    expect(component.selectedNetwork).toBe('ERC20');
    const networkCard = fixture.debugElement.query(By.css('app-network-select-card'));
    networkCard.triggerEventHandler('networkChanged', 'BTC');
    fixture.detectChanges();
    expect(component.selectedNetwork).toBe('BTC');
  });

  it('should call trackEvent on trackService when Continue Button clicked', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should save transaction data and navigate when Continue Button clicked and form valid', () => {
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/summary']);
  });
});

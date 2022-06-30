import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { DirectaPage } from './directa.page';

const validForm = {
  usdAmount: 200
};

describe('DirectaPage', () => {
  let component: DirectaPage;
  let fixture: ComponentFixture<DirectaPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let fakeActivatedRoute: FakeActivatedRoute;
  

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = new FakeNavController().createSpy();
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        setProvider: null,
      });

      coinsSpy = [
        jasmine.createSpyObj('Coin', {}, { value: 'USDC', network: 'MATIC' }),
        jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
      ];
      fakeActivatedRoute = new FakeActivatedRoute({ country: 'argentina' }, {});
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: coinsSpy,
      });

      TestBed.configureTestingModule({
        declarations: [DirectaPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DirectaPage);
      component = fixture.componentInstance;
      component.providers = rawProvidersData;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to tabs wallets when Continue is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Continue"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });

  it('should set country, default currency and provider on init', () => {
    fakeActivatedRoute.modifySnapshotParams({ country: 'argentina', alias: 'mercadopago'}, {});
    component.ionViewWillEnter();
    expect(component.country).toEqual({
      name: 'Argentina',
      value: 'fiat_ramps.countries_list.argentina',
      fiatCode: 'ars',
      isoCode: 'ARS',
    });
    expect(component.selectedCurrency).toEqual(coinsSpy[0]);
    expect(component.fiatCurrency).toEqual('USD');
    expect(fiatRampsServiceSpy.setProvider).toHaveBeenCalledOnceWith('2')
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { KriptonPurchaseInfoComponent } from './kripton-purchase-info.component';

describe('KriptonPurchaseInfoComponent', () => {
  let component: KriptonPurchaseInfoComponent;
  let fixture: ComponentFixture<KriptonPurchaseInfoComponent>;
  let kriptonPurchaseInfoSpy: jasmine.SpyObj<any>;
  beforeEach(waitForAsync(() => {
    kriptonPurchaseInfoSpy = jasmine.createSpyObj(
      'kriptonPurchaseInfo',
      {},
      {
        currencyOut: 'MATIC',
        currencyIn: 'ars',
        network: 'testNetwork',
        amountOut: '1222',
        priceOut: '12',
        operationId: '2',
        imageType: '.svg'
      }
    );
    TestBed.configureTestingModule({
      declarations: [KriptonPurchaseInfoComponent, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonPurchaseInfoComponent);
    component = fixture.componentInstance;
    component.currencyOut = jasmine.createSpyObj('MATIC', {}, {
      value: kriptonPurchaseInfoSpy.currencyOut,
      logoRoute: 'assets/img/coins/MATIC.svg',
    });
    component.currencyIn = kriptonPurchaseInfoSpy.currencyIn;
    component.amountOut = kriptonPurchaseInfoSpy.amountOut;
    component.priceOut = kriptonPurchaseInfoSpy.priceOut;
    component.operationId = kriptonPurchaseInfoSpy.operationId;
    component.imageType = kriptonPurchaseInfoSpy.imageType;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-label.kpi__buy__title'));
    const accordeonEl = fixture.debugElement.query(By.css('.kpi__buy__accordion-group'));
    const imgEl = fixture.debugElement.query(By.css('div.kpi__buy__accordion-group__accordion__item__header img'));
    const currencyOutEl = fixture.debugElement.query(
      By.css('ion-label.kpi__buy__accordion-group__accordion__item__header__coin__value')
    );
    const badgeEl = fixture.debugElement.query(
      By.css('app-token-network-badge')
    );
    const amountOutEl = fixture.debugElement.query(
      By.css('ion-label.kpi__buy__accordion-group__accordion__item__header__value')
    );
    const quoteTitleEl = fixture.debugElement.query(By.css('ion-label.kpi__buy__quote-title'));
    const [quoteDataEl, operationIdEl] = fixture.debugElement.queryAll(By.css('ion-label.kpi__buy__accordion-group__accordion__item__content__data__value'));
    const operationTitleEl = fixture.debugElement.query(By.css('ion-label.kpi__buy__operation-title'));

    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.kripton_purchase_info.title');
    expect(accordeonEl).toBeTruthy();
    expect(imgEl.attributes.src).toContain('assets/img/coins/MATIC.svg');
    expect(currencyOutEl.nativeElement.innerHTML).toContain('MATIC');
    expect(badgeEl).toBeTruthy();
    expect(amountOutEl.nativeElement.innerHTML).toContain('1222');
    expect(quoteTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.kripton_purchase_info.quote');
    expect(quoteDataEl.nativeElement.innerHTML).toContain('1 MATIC = 12 ARS');
    expect(operationTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.kripton_purchase_info.operation');
    expect(operationIdEl.nativeElement.innerHTML).toContain('N° 2')
  });
});
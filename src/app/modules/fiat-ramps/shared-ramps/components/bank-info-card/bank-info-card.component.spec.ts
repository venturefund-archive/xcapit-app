import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { BankInfoCardComponent } from './bank-info-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { BankInfo } from '../../interfaces/bank-info.interface';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';

const allBanks: BankInfo[] = [
  {
      providerId: 1,
      countryIsoCode: "COL",
      name: "Bancolombia",
      extras: [
          {
              key: "Darico Market",
              value: "NIT 9015741364"
          }
      ]
  },
  {
      providerId: 1,
      countryIsoCode: "ARS",
      name: "Santander",
      extras: [
          {
              key: "CBU",
              value: "0720042720000001730586"
          },
          {
              key: "Alias",
              value: "kriptonmarket.ars"
          }
      ]
    }
  ]

const concept: any = 'Cash In'

const operation: FiatRampOperation = {
  operation_id: 678,
  operation_type: 'cash-in',
  status: 'cancel',
  currency_in: 'ARS',
  amount_in: 500.0,
  currency_out: 'USDT',
  amount_out: 155.99,
  created_at: new Date('2021-02-27T10:02:49.719Z'),
  provider: '1',
  voucher: false,
};

const COUNTRIES: FiatRampProviderCountry[] = [
  { name: 'Costa Rica', value: 'fiat_ramps.countries_list.costa_rica', fiatCode: 'crc', isoCodeAlpha3: 'CRI' },
  { name: 'Colombia', value: 'fiat_ramps.countries_list.colombia', fiatCode: 'cop', isoCodeAlpha3: 'COL' },
  { name: 'Argentina', value: 'fiat_ramps.countries_list.argentina', fiatCode: 'ars', isoCodeAlpha3: 'ARS' },
];

const provider = rawProvidersData[1];

describe('BankInfoCardComponent', () => {
  let component: BankInfoCardComponent;
  let fixture: ComponentFixture<BankInfoCardComponent>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(waitForAsync(() => {
    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', {write: Promise.resolve()});
    toastServiceSpy = jasmine.createSpyObj('ToastService', {showSuccessToast: Promise.resolve()});
    TestBed.configureTestingModule({
      declarations: [ BankInfoCardComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        TranslateService,
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BankInfoCardComponent);
    component = fixture.componentInstance;
    component.concept = concept;
    component.provider = provider;
    component.operation = operation;
    component.allBanks = allBanks;
    component.countries = COUNTRIES;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', () => {
    component.ngOnInit();
    const bankInfoNameEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__bank'));
    const bankInfoExtraKeyEl =  fixture.debugElement.query(By.css('.bic__content__item__container__header__extra-key'));
    const operationCurrencyAmountInEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__amount'));
    const conceptNameEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__concept'));

    expect(bankInfoNameEl.nativeElement.innerHTML).toContain('Santander');
    expect(bankInfoExtraKeyEl.nativeElement.innerHTML).toContain('CBU');
    expect(operationCurrencyAmountInEl.nativeElement.innerHTML).toContain('500');
    expect(conceptNameEl.nativeElement.innerHTML).toContain('Cash In');
  });

  it('should copy amount and show toast when ux_copy_amount button is clicked', async() => {
    fixture.debugElement.query(By.css('ion-button[name="ux_copy_amount"]')).nativeElement.click();
    await fixture.whenStable();

    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({string: operation.amount_in.toString()});
    expect(toastServiceSpy.showSuccessToast).toHaveBeenCalledOnceWith({ message: 'fiat_ramps.operation_detail.bank_info_card.copy_success_text' });
  });

  it('should copy concept and show toast when ux_copy_concept button is clicked', async() => {
    fixture.debugElement.query(By.css('ion-button[name="ux_copy_concept"]')).nativeElement.click();
    await fixture.whenStable();

    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({string: concept});
    expect(toastServiceSpy.showSuccessToast).toHaveBeenCalledOnceWith({ message: 'fiat_ramps.operation_detail.bank_info_card.copy_success_text' });
  });

  it('should copy extras and show toast when ux_copy_extra button is clicked', async() => {
    fixture.debugElement.queryAll(By.css('ion-button[name="ux_copy_extra"]'))[0].nativeElement.click();
    await fixture.whenStable();

    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({string: allBanks[1].extras[0].value});
    expect(toastServiceSpy.showSuccessToast).toHaveBeenCalledOnceWith({ message: 'fiat_ramps.operation_detail.bank_info_card.copy_success_text' });
  });
});

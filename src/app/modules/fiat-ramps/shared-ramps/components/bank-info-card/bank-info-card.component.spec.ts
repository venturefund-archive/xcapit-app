import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';

import { BankInfoCardComponent } from './bank-info-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { BankInfo } from '../../interfaces/bank-info.interface';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';

const concept: any = 'Cash In'

const bankInfo: BankInfo = {
  providerId: 1,
  countryIsoCode: "ARS",
  name: 'Santander',
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

describe('BankInfoCardComponent', () => {
  let component: BankInfoCardComponent;
  let fixture: ComponentFixture<BankInfoCardComponent>;
  let fiatRampOperationSpy: jasmine.SpyObj<FiatRampOperation>;
  let fiatRampProviderSpy: jasmine.SpyObj<FiatRampProvider>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>

  beforeEach(waitForAsync(() => {
    fiatRampOperationSpy = jasmine.createSpyObj('Operation', {}, {amount_in: '150', currency_in: 'ARS'});
    fiatRampProviderSpy = jasmine.createSpyObj('Provider', {}, {id: 1});
    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['write']);
    TestBed.configureTestingModule({
      declarations: [ BankInfoCardComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankInfoCardComponent);
    component = fixture.componentInstance;
    component.concept = concept;
    component.provider = fiatRampProviderSpy;
    component.operation = fiatRampOperationSpy;
    component.bankInfo = bankInfo
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    
    const bankInfoNameEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__bank'));
    const bankInfoExtraKeyEl =  fixture.debugElement.query(By.css('.bic__content__item__container__header__extra-key'))
    const operationCurrencyAmountInEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__amount'))
    const conceptNameEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__concept'));

    expect(bankInfoNameEl.nativeElement.innerHTML).toContain('Santander');
    expect(bankInfoExtraKeyEl.nativeElement.innerHTML).toContain('CBU');
    expect(operationCurrencyAmountInEl.nativeElement.innerHTML).toContain('150');
    expect(conceptNameEl.nativeElement.innerHTML).toContain('Cash In');
  })

  // Uncaught Error: Uncaught (in promise): NotAllowedError: Document is not focused. thrown

  // it('should copy data when the clipboard button is clicked', async () => {
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   await fixture.whenRenderingDone();

  //   fixture.debugElement.query(By.css('ion-button[name="ux_copy_amount"]')).nativeElement.click();
    
  //   expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1)
  // })
});

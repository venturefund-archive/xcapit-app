import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { KriptonAccountInfoCardComponent } from './kripton-account-info-card.component';

fdescribe('KriptonAccountInfoCardComponent', () => {
  let component: KriptonAccountInfoCardComponent;
  let fixture: ComponentFixture<KriptonAccountInfoCardComponent>;
  let kriptonAccountInfoSpy: jasmine.SpyObj<any>;
  beforeEach(waitForAsync(() => {
    kriptonAccountInfoSpy = jasmine.createSpyObj(
      'kriptonAccountInfo',
      {},
      {
        alias: 'testKriptonAlias',
        cbu: 'testKriptonCbu',
        owner: 'Kripton SA.',
      }
    );
    TestBed.configureTestingModule({
      declarations: [KriptonAccountInfoCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonAccountInfoCardComponent);
    component = fixture.componentInstance;
    component.country = 'arg';
    component.currency = 'ARS';
    component.amount = 200000;
    component.kriptonAccountInfo = kriptonAccountInfoSpy;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    const titleEl = fixture.debugElement.query(By.css('ion-label.kaic__title'));
    const imgEl = fixture.debugElement.query(By.css('.kaic__details__amount img'));
    const [currencyEl, currencyTypeEl] = fixture.debugElement.queryAll(
      By.css('.kaic__details__amount__currency ion-label')
    );
    const amountEl = fixture.debugElement.query(By.css('ion-label.kaic__details__amount__value'));
    const copyAmountIconEl = fixture.debugElement.query(By.css('img[class="copy-icon-amount"]'));
    const aliasTitleEl = fixture.debugElement.query(By.css('ion-label.alias-title'));
    const aliasEl = fixture.debugElement.query(By.css('ion-label.alias'));
    const copyAliasIconEl = fixture.debugElement.query(By.css('img[class="copy-icon-alias"]'));
    const cbuTitleEl = fixture.debugElement.query(By.css('ion-label.cbu-title'));
    const cbuEl = fixture.debugElement.query(By.css('ion-label.cbu'));
    const copyCbuIconEl = fixture.debugElement.query(By.css('img[class="copy-icon-cbu"]'));
    const ownerTitleEl = fixture.debugElement.query(By.css('ion-label.owner-title'));
    const ownerEl = fixture.debugElement.query(By.css('ion-label.owner'));

    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.kripton_account_info.title');
    expect(imgEl.attributes.src).toContain('/assets/img/purchase-order/arg-flag.svg');
    expect(currencyEl.nativeElement.innerHTML).toContain('ARS');
    expect(currencyTypeEl.nativeElement.innerHTML).toContain(
      'fiat_ramps.shared.kripton_account_info.currency_type.arg'
    );
    expect(amountEl.nativeElement.innerHTML).toContain('$20000');
    expect(copyAmountIconEl.attributes.src).toBeTruthy();
    expect(copyAmountIconEl.attributes.src).toContain('/assets/img/purchase-order/copy.svg');
    expect(aliasTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.kripton_account_info.alias');
    expect(aliasEl.nativeElement.innerHTML).toContain('testKriptonAlias');
    expect(cbuTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.kripton_account_info.cbu');
    expect(cbuEl.nativeElement.innerHTML).toContain('testKriptonCbu');
    expect(copyAliasIconEl.attributes.src).toBeTruthy();
    expect(copyAliasIconEl.attributes.src).toContain('/assets/img/purchase-order/copy.svg');
    expect(copyCbuIconEl.attributes.src).toBeTruthy();
    expect(ownerTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.kripton_account_info.owner');
    expect(ownerEl.nativeElement.innerHTML).toContain('Kripton SA.');
    expect(copyCbuIconEl.attributes.src).toContain('/assets/img/purchase-order/copy.svg');
  });

  it('should emit copyValue event in different buttons', () => {
    const spy = spyOn(component.copyValue, 'emit');
    const copyAmountEl = fixture.debugElement.query(By.css('img[class="copy-icon-amount"]'));
    const copyAliasEl = fixture.debugElement.query(By.css('img[class="copy-icon-alias"]'));
    const copyCbuEl = fixture.debugElement.query(By.css('img[class="copy-icon-cbu"]'));
    copyAmountEl.nativeElement.click();
    copyAliasEl.nativeElement.click();
    copyCbuEl.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(3);
  });


});

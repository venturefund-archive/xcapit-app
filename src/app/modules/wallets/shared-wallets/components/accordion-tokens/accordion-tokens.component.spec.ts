import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Coin } from '../../interfaces/coin.interface';
import { TokenDetail } from '../../models/token-detail/token-detail';
import { TokenDetailController } from '../../models/token-detail/token-detail.controller';
import { AccordionTokensComponent } from './accordion-tokens.component';

describe('AccordionTokensComponent', () => {
  let component: AccordionTokensComponent;
  let fixture: ComponentFixture<AccordionTokensComponent>;
  let tokenDetailControllerSpy: jasmine.SpyObj<TokenDetailController>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(waitForAsync(() => {
    tokenDetailSpy = jasmine.createSpyObj(
      'TokenDetail',
      { cached: Promise.resolve({ balance: 10, price: 2 }), fetch: Promise.resolve(), cache: Promise.resolve() },
      {
        price: 20,
        balance: 1,
        quoteSymbol: 'USD',
        coin: coinSpy,
      }
    );
    tokenDetailControllerSpy = jasmine.createSpyObj('TokenDetailSpy', { new: tokenDetailSpy });
    coinSpy = jasmine.createSpyObj('Coin', {}, { logoRoute: '', value: 'ETH', name: 'Ethereum', network: 'ERC20' });
    const fakeTokenDetails: TokenDetail[] = [
      tokenDetailSpy,
      tokenDetailSpy,
      tokenDetailSpy,
      tokenDetailSpy,
      tokenDetailSpy,
    ];

    TestBed.configureTestingModule({
      declarations: [AccordionTokensComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: TokenDetailController, useValue: tokenDetailControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionTokensComponent);
    component = fixture.componentInstance;
    component.tokenDetails = fakeTokenDetails;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should collapse accordion when Close Accordion button is clicked', () => {
    component.accordionGroup.value = 'coins';
    component.openedAccordion = true;
    component.ngOnInit();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Close Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeFalse();
    expect(component.accordionGroup.value).toBeFalsy();
  });

  it('should expand accordion when Open Accordion button is clicked', () => {
    component.ngOnInit();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Open Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeTrue();
    expect(component.accordionGroup.value).toBe('coins');
  });

  it('should filter token details of complete data', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.firstTokenDetails).toEqual([tokenDetailSpy, tokenDetailSpy, tokenDetailSpy, tokenDetailSpy]);
    expect(component.remainingTokenDetails).toEqual([tokenDetailSpy]);
  });

  it('should get quote price on ngOnChanges if autoprice is true', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const change: SimpleChanges = { tokenDetails: new SimpleChange(component.tokenDetails, [tokenDetailSpy], true)}  
    component.ngOnChanges(change);
    fixture.detectChanges();
    expect(component.firstTokenDetails).toEqual([tokenDetailSpy]);
  });
});

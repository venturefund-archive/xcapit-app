import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TransactionInProgressCardComponent } from './transaction-in-progress-card.component';

describe('TransactionInProgressCardComponent', () => {
  let component: TransactionInProgressCardComponent;
  let fixture: ComponentFixture<TransactionInProgressCardComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve()
    });
    TestBed.configureTestingModule({
      declarations: [TransactionInProgressCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionInProgressCardComponent);
    component = fixture.componentInstance;
    component.transaction = new TxInProgress('send', 'MATIC', '0x1234123');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show swap text and image', () => {
    component.transaction = new TxInProgress('swap');
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('.tipc__container__content > ion-text')).nativeElement;
    const hourEl = fixture.debugElement.query(By.css('.tipc__container__timestamp > ion-text')).nativeElement;
    const imgEl = fixture.debugElement.query(By.css('img'));
    expect(textEl.textContent).toContain('wallets.home.transaction_in_progress.swap_title');
    expect(hourEl.textContent).toMatch(/\d\d:\d\d/g);
    expect(imgEl.attributes.src).toContain('assets/img/shared/transactions/swap.svg');
  });

  it('should show send text and image', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('.tipc__container__content > ion-text')).nativeElement;
    const hourEl = fixture.debugElement.query(By.css('.tipc__container__timestamp > ion-text')).nativeElement;
    const imgEl = fixture.debugElement.query(By.css('img'));
    expect(textEl.textContent).toContain('wallets.home.transaction_in_progress.send_title');
    expect(hourEl.textContent).toMatch(/\d\d:\d\d/g);
    expect(imgEl.attributes.src).toContain('assets/img/shared/transactions/send.svg');
  });

  it('should redirect to scan in send', () => {
    component.transaction = new TxInProgress('send', 'MATIC', '0xffff');
    component.ngOnInit();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-item')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({
      url: 'https://mumbai.polygonscan.com/tx/0xffff',
    });
  });

  it('should not redirect to scan in swap', () => {
    component.transaction = new TxInProgress('swap');
    component.ngOnInit();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-item')).nativeElement.click();
    expect(browserServiceSpy.open).not.toHaveBeenCalled();
  });
});

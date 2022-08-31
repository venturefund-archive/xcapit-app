import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TransactionDetailsPage } from './transaction-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDetailsService } from '../shared-wallets/services/transaction-details/transaction-details.service';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

fdescribe('TransactionDetailsPage', () => {
  let component: TransactionDetailsPage;
  let fixture: ComponentFixture<TransactionDetailsPage>;
  let transactionDetailsServiceSpy: jasmine.SpyObj<TransactionDetailsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    transactionDetailsServiceSpy = jasmine.createSpyObj(
      'TransactionDetailsService',
      {},
      {
        transactionData: { all: () => [] },
      }
    );

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [TransactionDetailsPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: TransactionDetailsService, useValue: transactionDetailsServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should open 2PI T&C when T&C link is clicked', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-label.checkbox-link > ion-text:last-child')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: LINKS.twoPiTermsAndConditions });
  });
});

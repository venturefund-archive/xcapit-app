import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ShareTransactionDetailComponent } from './share-transaction-detail.component';

describe('ShareTransactionDetailComponent', () => {
  let component: ShareTransactionDetailComponent;
  let fixture: ComponentFixture<ShareTransactionDetailComponent>;
  let shareServiceSpy: jasmine.SpyObj<ShareService>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let transactionSpy: jasmine.SpyObj<any>;
  beforeEach(waitForAsync(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastServiceSpy', {
      showInfoToast: Promise.resolve(),
    });

    transactionSpy = jasmine.createSpyObj('transaction',{}, {
      txAmount: 5,
      txAsset: 'MATIC',
      txLink: 'testLink.com'
    })

    clipboardServiceSpy = jasmine.createSpyObj('ClipboardServiceSpy', {
      write: Promise.resolve(),
    });

    shareServiceSpy = jasmine.createSpyObj('ShareServiceSpy', {
      canShare: Promise.resolve(true),
      share: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [ShareTransactionDetailComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ShareService, useValue: shareServiceSpy },
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareTransactionDetailComponent);
    component = fixture.componentInstance;
    component.txAmount = transactionSpy.txAmount;
    component.txAsset = transactionSpy.txAsset;
    component.txLink = transactionSpy.txLink;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if share is available on init', () => {
    expect(component.canShare).toBeTrue();
  });

  it('should share transaction detail when component is clicked', async () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.td')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(shareServiceSpy.share).toHaveBeenCalledOnceWith({
      text: 'wallets.shared_wallets.share_transaction_detail.text5 MATIC. wallets.shared_wallets.share_transaction_detail.text2 testLink.com',
      dialogTitle: 'wallets.shared_wallets.share_transaction_detail.dialogTitle',
    });
  });

  it('should copy on clipboard and show toast when share fail', async () => {
    shareServiceSpy.share.and.rejectWith({ message: '' });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.td')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({
      string:
        'wallets.shared_wallets.share_transaction_detail.text5 MATIC. wallets.shared_wallets.share_transaction_detail.text2 testLink.com',
    });
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledOnceWith({
      message: 'wallets.shared_wallets.share_transaction_detail.share_error',
    });
  });

  it('should not copy on clipboard when user cancels sharing', async () => {
    shareServiceSpy.share.and.rejectWith({ message: 'Error: Share canceled' });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.td')).nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(0);
  });

});

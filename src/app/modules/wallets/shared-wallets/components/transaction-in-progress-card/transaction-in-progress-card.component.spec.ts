import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionInProgressCardComponent } from './transaction-in-progress-card.component';

describe('TransactionInProgressCardComponent', () => {
  let component: TransactionInProgressCardComponent;
  let fixture: ComponentFixture<TransactionInProgressCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionInProgressCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionInProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tx hour', () => {
    // TODO: Test this
  });

  it('should show swap text and image', () => {
    component.transaction = 'swap';
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('.tipc__container__content > ion-text')).nativeElement;
    const imgEl = fixture.debugElement.query(By.css('img'));
    expect(textEl.textContent).toContain('wallets.home.transaction_in_progress.swap_title');
    expect(imgEl.attributes.src).toContain('assets/img/shared/transactions/swap.svg');
  });

  it('should show send text and image', () => {
    component.transaction = 'send';
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('.tipc__container__content > ion-text')).nativeElement;
    const imgEl = fixture.debugElement.query(By.css('img'));
    expect(textEl.textContent).toContain('wallets.home.transaction_in_progress.send_title');
    expect(imgEl.attributes.src).toContain('assets/img/shared/transactions/send.svg');
  });
});

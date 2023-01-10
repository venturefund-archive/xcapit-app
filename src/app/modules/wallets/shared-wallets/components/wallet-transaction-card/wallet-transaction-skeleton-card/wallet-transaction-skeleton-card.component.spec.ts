import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { WalletTransactionSkeletonCardComponent } from './wallet-transaction-skeleton-card.component';
describe('WalletTransactionSkeletonCardComponent', () => {
  let component: WalletTransactionSkeletonCardComponent;
  let fixture: ComponentFixture<WalletTransactionSkeletonCardComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WalletTransactionSkeletonCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTransactionSkeletonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const skeletonItems = fixture.debugElement.queryAll(By.css('div.wtsc__list__item'));
    expect(skeletonItems.length).toEqual(3);
  });
});

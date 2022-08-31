import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TransactionDetailsPage } from './transaction-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDetailsService } from '../shared-wallets/services/transaction-details/transaction-details.service';

fdescribe('TransactionDetailsPage', () => {
  let component: TransactionDetailsPage;
  let fixture: ComponentFixture<TransactionDetailsPage>;
  let transactionDetailsServiceSpy: jasmine.SpyObj<TransactionDetailsService>

  beforeEach(waitForAsync(() => {
    transactionDetailsServiceSpy = jasmine.createSpyObj('TransactionDetailsService', {},{
      transactionData: {all: ()=> [] },
    });

    TestBed.configureTestingModule({
      declarations: [TransactionDetailsPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers:[]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

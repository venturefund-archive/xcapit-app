import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { AssetDetailComponent } from './asset-detail.component';

describe('AssetDetailComponent', () => {
  let component: AssetDetailComponent;
  let fixture: ComponentFixture<AssetDetailComponent>;

  const testData = {
    token: 'USDC',
    blockchain: 'MATIC',
    tokenLogo: 'assets/img/coins/USDC.png'
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDetailComponent ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDetailComponent);
    component = fixture.componentInstance;
    component.token = testData.token;
    component.blockchain = testData.blockchain;
    component.tokenLogo = testData.tokenLogo;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('.ad__title > ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('app-token-network-badge'));
    const imgEl = fixture.debugElement.query(By.css('.ad > img'));
    expect(titleEl.nativeElement.innerHTML).toContain(testData.token);
    expect(subtitleEl.nativeElement.blockchainName).toContain(testData.blockchain);
    expect(imgEl.attributes.src).toContain(testData.tokenLogo);
  });
});

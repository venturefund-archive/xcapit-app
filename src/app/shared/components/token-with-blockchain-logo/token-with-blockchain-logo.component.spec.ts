import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { TokenWithBlockchainLogoComponent } from './token-with-blockchain-logo.component';

describe('TokenWithBlockchainLogoComponent', () => {
  let component: TokenWithBlockchainLogoComponent;
  let fixture: ComponentFixture<TokenWithBlockchainLogoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TokenWithBlockchainLogoComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenWithBlockchainLogoComponent);
    component = fixture.componentInstance;
    component.tokenLogo = 'src/assets/test_image.svg';
    component.blockchainLogo = 'src/assets/test_image.svg';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render images properly', () => {
    const [tokenLogoEl, blockchainLogoEl] = fixture.debugElement.queryAll(By.css('.twbl__img img'));
    expect(tokenLogoEl.nativeElement.src).toContain('src/assets/test_image.svg');
    expect(blockchainLogoEl.nativeElement.src).toContain('src/assets/test_image.svg');
  });
});

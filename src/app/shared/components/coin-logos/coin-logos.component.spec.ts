import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { CoinLogosComponent } from './coin-logos.component';

describe('CoinLogosComponent', () => {
  let component: CoinLogosComponent;
  let fixture: ComponentFixture<CoinLogosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CoinLogosComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinLogosComponent);
    component = fixture.componentInstance;
    component.tokenLogo = 'tokenTestLogo';
    component.nativeTokenLogo = 'nativeTokenTestLogo';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render images properly', () => {
    const [tokenLogoEl, nativeTokenLogoEl] = fixture.debugElement.queryAll(By.css('.cl__img img'));
    expect(tokenLogoEl.nativeElement.src).toContain('tokenTestLogo');
    expect(nativeTokenLogoEl.nativeElement.src).toContain('nativeTokenTestLogo');
  });
});

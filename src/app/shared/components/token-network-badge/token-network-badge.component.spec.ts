import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormattedNetworkPipe } from '../../pipes/formatted-network-name/formatted-network.pipe';
import { TokenNetworkBadgeComponent } from './token-network-badge.component';

fdescribe('TokenNetworkBadgeComponent', () => {
  let component: TokenNetworkBadgeComponent;
  let fixture: ComponentFixture<TokenNetworkBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenNetworkBadgeComponent, FormattedNetworkPipe ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenNetworkBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly display badge color', () => {
    component.blockchainName = "SOLANA";
    fixture.detectChanges();
    const color = fixture.debugElement.query(By.css('ion-badge')).nativeElement.color;
    expect(color).toEqual('alt-5-light');
  })
});

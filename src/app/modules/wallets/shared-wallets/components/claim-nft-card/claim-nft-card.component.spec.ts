import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { ClaimNftCardComponent } from './claim-nft-card.component';

describe('ClaimNftCardComponent', () => {
  let component: ClaimNftCardComponent;
  let fixture: ComponentFixture<ClaimNftCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ClaimNftCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClaimNftCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ClaimNftCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly the base page when the claim window is closed', () => {
    fixture.debugElement.query(By.css('ion-button.close_claim')).nativeElement.click();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-text.cnc__base__title'));
    const imageEl = fixture.debugElement.query(By.css('img.cnc__base__image'));
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.base');
    expect(imageEl.attributes.src).toEqual('assets/img/wallets/growing_rafiki.svg');
  });

  it('should render properly the claim page on init and the nft status is unclaimed', () => {
    const closeButtonEl = fixture.debugElement.query(By.css('ion-button.close_claim'));
    const titleEl = fixture.debugElement.query(By.css('ion-text.cnc__claim__title'));
    const subtitleEl = fixture.debugElement.query(By.css('ion-text.cnc__claim__subtitle'));
    const noteEl = fixture.debugElement.query(By.css('ion-text.cnc__claim__note'));
    const claimButtonEl = fixture.debugElement.query(By.css('ion-button.cnc__claim__button-claim'));
    expect(closeButtonEl).toBeTruthy();
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.unclaimed_title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.unclaimed_subtitle');
    expect(noteEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.unclaimed_note');
    expect(claimButtonEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.button_claim');
  });

  it('should render properly the claim page on init and the nft status is claimed', () => {
    component.nftStatus = 'claimed';
    fixture.detectChanges();
    const closeButtonEl = fixture.debugElement.query(By.css('ion-button.close_claim'));
    const titleEl = fixture.debugElement.query(By.css('ion-text.cnc__claim__title'));
    const subtitleEl = fixture.debugElement.query(By.css('ion-text.cnc__claim__subtitle'));
    const noteEl = fixture.debugElement.query(By.css('ion-text.cnc__claim__note'));
    const claimButtonEl = fixture.debugElement.query(By.css('ion-button.cnc__claim__button-claim'));
    expect(claimButtonEl).toBeNull();
    expect(closeButtonEl).toBeTruthy();
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.claimed_title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.claimed_subtitle');
    expect(noteEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.claimed_note');
  });

  it('should emit nftRequest event to parent when Claim button is clicked', () => {
    const spy = spyOn(component.nftRequest, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="Claim"]')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it(`should call trackEvent when Claim is clicked`, () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Claim');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

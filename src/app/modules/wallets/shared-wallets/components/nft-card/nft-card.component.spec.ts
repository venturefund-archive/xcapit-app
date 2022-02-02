import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { NftService } from '../../services/nft-service/nft.service';
import { NavigationExtras } from '@angular/router';
import { NftCardComponent } from './nft-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const nftData = {
  name: 'testName',
  description: 'Test',
  image: 'assets/test_image.svg',
  tokenID: 5,
  attributes: [
    {
      trait_type: 'Art',
      value: 'Paint',
    },
  ],
};

const testNavigationExtras: NavigationExtras = {
  state: {
    nftMetadata: nftData,
  },
};

describe('NftCardComponent', () => {
  let component: NftCardComponent;
  let fixture: ComponentFixture<NftCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NftCardComponent>;
  let nftServiceSpy: jasmine.SpyObj<NftService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      nftServiceSpy = jasmine.createSpyObj('NftService', {
        getNFTMetadata: Promise.resolve(nftData),
      });
      TestBed.configureTestingModule({
        declarations: [NftCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NftService, useValue: nftServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas:[CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(NftCardComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly the base page when the claim window is closed', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button.close_claim')).nativeElement.click();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-text.cnc__base__title'));
    const imageEl = fixture.debugElement.query(By.css('img.cnc__base__image'));
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.base');
    expect(imageEl.attributes.src).toEqual('assets/img/wallets/growing_rafiki.svg');
  });

  it('should render properly the claim page on init and the nft status is unclaimed', () => {
    fixture.detectChanges();
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
    expect(closeButtonEl).toBeTruthy();
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.claimed_title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.claimed_subtitle');
    expect(noteEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.claimed_note');
    expect(claimButtonEl).toBeNull();
  });

  it('should emit nftRequest event to parent when Claim button is clicked', () => {
    fixture.detectChanges();
    const spy = spyOn(component.nftRequest, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="Claim"]')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it(`should call trackEvent when Claim is clicked`, () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Claim');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate when goToDetail is called', async () => {
    component.nftStatus = 'delivered';
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const goToDetailEl = fixture.debugElement.query(By.css('.cnc__showNFT'));
    goToDetailEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/nft-detail'], testNavigationExtras);
  });

  it('should render properly the base page when the nft status is delivered but the wallet dont have nft', async () => {
    nftServiceSpy.getNFTMetadata.and.returnValue(Promise.resolve());
    component.nftStatus = 'delivered';
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cnc__base'))).toBeTruthy();
  });

  it('should render properly the skeleton when NFTData are not chargued yet', async () => {
    component.nftStatus = 'delivered';
    nftServiceSpy.getNFTMetadata.and.returnValue((Promise.resolve()))
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-nft-card-skeleton'))).toBeTruthy();
  });

});

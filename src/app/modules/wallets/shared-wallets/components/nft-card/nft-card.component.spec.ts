import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NftService } from '../../services/nft-service/nft.service';
import { NavigationExtras } from '@angular/router';
import { NftCardComponent } from './nft-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const nftData = {
  name: 'testName',
  description: 'Test',
  image: 'assets/test_image.svg',
  contractAddress: '0x9592a6cb3a9d53ff9967610e12b503e53929ffaf',
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
  let nftServiceSpy: jasmine.SpyObj<NftService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      nftServiceSpy = jasmine.createSpyObj('NftService', {
        getNFTMetadata: Promise.resolve([nftData]),
      });
      TestBed.configureTestingModule({
        declarations: [NftCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NftService, useValue: nftServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas:[CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(NftCardComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly the base page when card = "base" and there are no nfts', () => {
    component.card = 'base';
    component.NFTdata = [];
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-text.cnc__base__title'));
    const imageEl = fixture.debugElement.query(By.css('img.cnc__base__image'));
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.shared_wallets.claim_nft_card.base');
    expect(imageEl.attributes.src).toEqual('assets/img/wallets/growing_rafiki.svg');
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
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/nft-detail'], testNavigationExtras);
  });

  it('should render properly the base page when the nft status is delivered but the wallet dont have nft', async () => {
    component.nftStatus = 'delivered';
    nftServiceSpy.getNFTMetadata.and.resolveTo([]);
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cnc__base'))).toBeTruthy();
  });

  it('should render properly the skeleton when NFTData are not chargued yet', async () => {
    component.nftStatus = 'delivered';
    nftServiceSpy.getNFTMetadata.and.resolveTo([]);
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-nft-card-skeleton'))).toBeTruthy();
  });

});

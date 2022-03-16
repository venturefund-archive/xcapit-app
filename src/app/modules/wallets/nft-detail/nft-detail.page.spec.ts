import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Navigation, Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NFT_DATA_NONPROD } from '../shared-wallets/constants/nft-data-nonprod';
import { DefaultNFT } from '../shared-wallets/models/nft/nft.class';
import { NftService } from '../shared-wallets/services/nft-service/nft.service';
import { NftDetailPage } from './nft-detail.page';

const NFTMetadata = {
  description: 'Test',
  name: 'testName',
  image: 'assets/test_image.svg',
  contractAddress: '0x9592a6cb3a9d53ff9967610e12b503e53929ffaf',
  tokenID: 1234,
  attributes: [
    {
      trait_type: 'Art',
      value: 'Paint',
    },
  ],
};

const nft = new DefaultNFT(NFTMetadata);

const getTestNavigationState = (state: boolean) => {
  return {
    id: 2,
    initialUrl: new UrlTree(),
    extractedUrl: new UrlTree(),
    trigger: 'imperative',
    previousNavigation: null,
    extras: state ? { state: { nft } } : {},
  } as Navigation;
};

describe('NftDetailPage', () => {
  let component: NftDetailPage;
  let fixture: ComponentFixture<NftDetailPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let nftServiceSpy: jasmine.SpyObj<NftService>;
  let routeSpy: jasmine.SpyObj<Router>;

  beforeEach(
    waitForAsync(() => {
      routeSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
      nftServiceSpy = jasmine.createSpyObj('NftService', {
        xcapitNFTs: Promise.resolve(nft),
        getNFTMexico: NFT_DATA_NONPROD,
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [NftDetailPage],
        imports: [
          IonicModule.forRoot(),
          TranslateModule.forRoot(),
          HttpClientTestingModule,
          ReactiveFormsModule,
          RouterTestingModule,
        ],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: NftService, useValue: nftServiceSpy },
          { provide: Router, useValue: routeSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(NftDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

      it('should render properly of nft card when nft metadata is passed by state', async () => {
          routeSpy.getCurrentNavigation.and.returnValue(getTestNavigationState(true));
      fixture = TestBed.createComponent(NftDetailPage);
      component = fixture.componentInstance;
      component.ionViewWillEnter();
      await fixture.whenStable();
      await fixture.whenRenderingDone();
      fixture.detectChanges();
      const imageEl = fixture.debugElement.query(By.css('img.nd__image'));
      const titleEl = fixture.debugElement.query(By.css('ion-text.nd__title'));
      const descriptionEl = fixture.debugElement.query(By.css('ion-text.nd__subtitle'));

      expect(imageEl.attributes.src).toEqual(NFTMetadata.image);
      expect(titleEl.nativeElement.innerHTML).toContain(NFTMetadata.name);
      expect(descriptionEl.nativeElement.innerHTML).toContain(NFTMetadata.description);
      expect(component.form.value.tokenID).toEqual(NFTMetadata.tokenID);
      expect(component.form.value.contractAddress).toEqual(NFT_DATA_NONPROD[0].contractAddress);
      expect(nftServiceSpy.xcapitNFTs).toHaveBeenCalledTimes(0);
    });
});

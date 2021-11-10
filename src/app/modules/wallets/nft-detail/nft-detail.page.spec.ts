import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NFT_DATA_NONPROD } from '../shared-wallets/constants/nft-data-nonprod';
import { NftService } from '../shared-wallets/services/nft-service/nft.service';
import { NftDetailPage } from './nft-detail.page';
const NFTMetadata = {
  description: 'Test',
  name: 'testName',
  image: 'testImage',
  tokenID: 1234,
  attributes: [
    {
      trait_type: 'Art',
      value: 'Paint',
    },
  ],
};

describe('NftDetailPage', () => {
  let component: NftDetailPage;
  let fixture: ComponentFixture<NftDetailPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let nftServiceSpy: jasmine.SpyObj<NftService>;
  beforeEach(
    waitForAsync(() => {
      nftServiceSpy = jasmine.createSpyObj('NftService', {
        getNFTMetadata: Promise.resolve(NFTMetadata),
        getNFTMexico: NFT_DATA_NONPROD,
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [NftDetailPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: NftService, useValue: nftServiceSpy },
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

  it('should render properly of nft card', async () => {
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
    expect(component.form.value.contractAddress).toEqual(NFT_DATA_NONPROD.contractAddress);
  });
});

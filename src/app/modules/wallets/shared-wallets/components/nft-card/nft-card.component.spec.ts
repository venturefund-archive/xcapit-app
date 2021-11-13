import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { NftCardComponent } from './nft-card.component';

const nftData = {
  name: 'TitleExample',
  description: 'XcapitMexico',
  image: 'https://gateway.pinata.cloud/ipfs/QmaVGgzWF7WEQvWzbx9q93f4zXqseGBJfSp7anjidLHcjm',
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
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [NftCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(NftCardComponent);
      component = fixture.componentInstance;

      component.data = nftData;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly of nft card', () => {
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('img.nv__img'));
    const titleEl = fixture.debugElement.query(By.css('ion-text.ux-font-titulos-xs'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.ux-font-text-xs'));
    expect(imageEl.attributes.src).toEqual(component.data.image);
    expect(titleEl.nativeElement.innerHTML).toContain(component.data.name);
    expect(descriptionEl.nativeElement.innerHTML).toContain(component.data.description);
  });

  it('should navigate when goToDetail is called', async () => {
    const goToDetailEl = fixture.debugElement.query(By.css("div[name='Go To Detail']"));
    goToDetailEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/nft-detail'], testNavigationExtras);
  });
});

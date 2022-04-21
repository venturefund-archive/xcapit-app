import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ProviderCardComponent } from './provider-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const providerTest = {
  id: 2,
  alias: 'kripton',
  name: 'Kripton Market',
  logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
  description: 'fiat_ramps.select_provider.krypton_description',
  newOperationRoute: '/fiat-ramps/new-operation',
  countries: ['Argentina', 'Venezuela', 'Uruguay', 'Peru', 'Colombia'],
};

describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ProviderCardComponent],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCardComponent);
    component = fixture.componentInstance;
    component.provider = providerTest;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('div.pcc__content__image'));
    const nameEl = fixture.debugElement.query(By.css('ion-text.pcc__content__body__name'));
    const cardInfoIconEl = fixture.debugElement.query(By.css('ion-text.pcc__content__body__description'));
    expect(imgEl.nativeElement.innerHTML).toBeTruthy();
    expect(nameEl.nativeElement.innerHTML).toContain(providerTest.name);
    expect(cardInfoIconEl.nativeElement.innerHTML).toContain(providerTest.description);
  });

  it('should emit event when radio button is checked', () => {
    component.disabled = true;
    const spy = spyOn(component.selectedProvider, 'emit');
    fixture.debugElement.query(By.css('ion-radio')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { WhatsAnApiKeyPage } from './whats-an-api-key.page';

describe('WhatsAnApiKeyPage', () => {
  let component: WhatsAnApiKeyPage;
  let fixture: ComponentFixture<WhatsAnApiKeyPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WhatsAnApiKeyPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(WhatsAnApiKeyPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to Register API key when Done button is clicked', () => {});

  it('should call trackEvent when Done button is clicked', () => {});
});

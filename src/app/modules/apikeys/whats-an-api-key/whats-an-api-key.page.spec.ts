import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WhatsAnApiKeyPage } from './whats-an-api-key.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('WhatsAnApiKeyPage', () => {
  let component: WhatsAnApiKeyPage;
  let fixture: ComponentFixture<WhatsAnApiKeyPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WhatsAnApiKeyPage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WhatsAnApiKeyPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          IonicModule.forRoot(),
          TranslateModule.forRoot(),
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([{ path: 'apikeys/register', component: DummyComponent }]),
        ],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(WhatsAnApiKeyPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to Register API key when Done button is clicked', () => {
    const el = fixture.debugElement.query(By.css('ion-button[name="Done"]')).nativeElement;
    el.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/apikeys/register');
  });

  it('should call trackEvent when Done button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Done');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

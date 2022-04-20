import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SelectProviderPage } from './select-provider.page';

describe('SelectProviderPage', () => {
  let component: SelectProviderPage;
  let fixture: ComponentFixture<SelectProviderPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectProviderPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SelectProviderPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectProviderPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_fiat_ramps_continue is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_fiat_ramps_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to provider url when ux_fiat_ramps_continue is clicked', () => {
    fixture.debugElement.query(By.css('app-select-provider-card')).triggerEventHandler('route', 'test');
    fixture.debugElement.query(By.css("ion-button[name='ux_fiat_ramps_continue']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['test']);
  });

  it('should reset form when country is changed', () => {
    const spy = spyOn(component.form.get('provider'), 'reset');
    fixture.debugElement.query(By.css('app-select-provider-card')).triggerEventHandler('onChange', 'Argentina');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.form.get('provider').value).toEqual('');
  });
});

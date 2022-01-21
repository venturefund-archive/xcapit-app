import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { ListApikeysPage } from './list-apikeys.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { By } from '@angular/platform-browser';
import { FundDataStorageService } from '../../funds/shared-funds/services/fund-data-storage/fund-data-storage.service';

const apiKeys = [
  { nombre_bot: 'test', id: 1, alias: 'testAlias' },
  { nombre_bot: '', id: 2, alias: '' },
  { nombre_bot: 'test3', id: 3, alias: 'testAlias3' },
];

describe('ListApikeysPage', () => {
  let component: ListApikeysPage;
  let fixture: ComponentFixture<ListApikeysPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ListApikeysPage>;
  let apiApikeysServiceSpy: jasmine.SpyObj<ApiApikeysService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let snapshotSpy: jasmine.SpyObj<any>;
  let fundDataStorageServiceSpy: jasmine.SpyObj<FundDataStorageService>;

  beforeEach(
    waitForAsync(() => {
      fundDataStorageServiceSpy = jasmine.createSpyObj('FundDataStorageService', { setData: Promise.resolve() });
      platformServiceSpy = jasmine.createSpyObj('PlatformService', { isWeb: true });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeyService', { getAll: of(apiKeys) });
      snapshotSpy = jasmine.createSpyObj(
        'Snapshot',
        {},
        {
          snapshot: {
            paramMap: convertToParamMap({
              mode: 'select',
            }),
          },
        }
      );
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', {}, snapshotSpy);
      TestBed.configureTestingModule({
        declarations: [ListApikeysPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), IonicModule.forRoot()],
        providers: [
          { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
          { provide: PlatformService, useValue: platformServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: FundDataStorageService, useValue: fundDataStorageServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set select mode on view will enter', () => {
    component.ionViewWillEnter();
    expect(component.selectMode).toBeTrue();
  });

  it('should get api keys when select mode is true on view will enter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.apikeys.length).toBe(1);
  });

  it('should navigate to /apikeys/register when platform is web and add api key button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Register New Key"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/apikeys/register']);
  });

  it('should navigate to /apikeys/scan when platform is not web and add api key button is clicked', async () => {
    platformServiceSpy.isWeb.and.returnValue(false);
    fixture.debugElement.query(By.css('ion-button[name="Register New Key"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/apikeys/scan']);
  });

  it('should update data and navigate to fund name page when key is selected', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    const apiKeyItemEl = fixture.debugElement.query(By.css('app-apikey-item'));
    apiKeyItemEl.triggerEventHandler('useButtonClicked', 2);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fundDataStorageServiceSpy.setData).toHaveBeenCalledOnceWith('apiKeyId', { api_key_id: 2 });
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-name']);
  });

  it('should delete api key from list when delete button is clicked', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.apikeys.find((key) => (key.id = 2))).toBeTruthy();
    const apiKeyItemEl = fixture.debugElement.query(By.css('app-apikey-item'));
    apiKeyItemEl.triggerEventHandler('deletedKey', 2);
    expect(component.apikeys.find((key) => (key.id = 2))).toBeFalsy();
  });

  it('should call trackEvent on trackService when Register New Key Button clicked', () => {
    spyOn(component, 'addApiKey');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Register New Key');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Register New Key More Button clicked', () => {
    spyOn(component, 'addApiKey');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Register New Key More');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

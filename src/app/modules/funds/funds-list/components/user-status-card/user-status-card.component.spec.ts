import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UserStatusCardComponent } from './user-status-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('UserStatusCardComponent', () => {
  let component: UserStatusCardComponent;
  let fixture: ComponentFixture<UserStatusCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserStatusCardComponent>;
  let localStorageService: LocalStorageService;
  let localStorageServiceMock: any;
  let userStatusMock: any;

  beforeEach(
    waitForAsync(() => {
      userStatusMock = {
        profile_valid: false,
        empty_linked_keys: false,
        has_own_funds: false,
        has_subscribed_funds: false,
        status_name: '',
      };

      localStorageServiceMock = {
        toggleHideFunds: () => undefined,
        getHideFunds: () => Promise.resolve(true),
      };
      TestBed.configureTestingModule({
        declarations: [UserStatusCardComponent, FakeTrackClickDirective, DummyComponent],
        imports: [
          IonicModule,
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'tutorials/interactive-tutorial', component: DummyComponent },
            { path: 'profiles/personal-data', component: DummyComponent },
            { path: 'profiles/user', component: DummyComponent },
            { path: 'notifications/list', component: DummyComponent },
          ]),
        ],
        providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }],
      }).compileComponents();

      fixture = TestBed.createComponent(UserStatusCardComponent);
      component = fixture.componentInstance;
      component.userStatus = userStatusMock;
      fixture.detectChanges();
      localStorageService = TestBed.inject(LocalStorageService);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setNewFundUrl on ngOnInit', () => {
    const spy = spyOn(component, 'setNewFundUrl');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  [
    ['BEGINNER', 'apikeys/tutorial/exchange'],
    ['EXPLORER', 'apikeys/tutorial/exchange'],
    ['COMPLETE', 'apikeys/list'],
    ['CREATOR', 'apikeys/list'],
  ].forEach(([statusName, expectedUrl]) => {
    it(`should set url to ${expectedUrl} when status is ${statusName}`, () => {
      component.userStatus.status_name = statusName;
      fixture.detectChanges();
      component.setNewFundUrl();
      fixture.detectChanges();
      expect(component.newFundUrl).toBe(expectedUrl);
    });
  });

  it('should call trackEvent on trackService when Action Button button clicked', () => {
    component.userStatus = {
      profile_valid: true,
      empty_linked_keys: true,
      has_own_funds: false,
      has_subscribed_funds: false,
      status_name: 'BEGINNER',
    };
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Action Button');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    spyOn(component, 'doActionButton');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

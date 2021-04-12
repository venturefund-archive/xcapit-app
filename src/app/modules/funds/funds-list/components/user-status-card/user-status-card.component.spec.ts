import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UserStatusCardComponent } from './user-status-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';
import { TabsComponent } from '../../../../tabs/tabs/tabs.component';
import { TrackClickDirective } from '../../../../../shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';

describe('UserStatusCardComponent', () => {
  let component: UserStatusCardComponent;
  let fixture: ComponentFixture<UserStatusCardComponent>;
  let tabsComponentMock: any;
  let tabsComponent: TabsComponent;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserStatusCardComponent>;

  const userStatusMock: any = {
    profile_valid: false,
    empty_linked_keys: false,
    has_own_funds: false,
    has_subscribed_funds: false,
    status_name: ''
  };

  beforeEach(waitForAsync(() => {
    tabsComponentMock = {
      newFundUrl: ''
    };
    TestBed.configureTestingModule({
      declarations: [
        UserStatusCardComponent,
        TrackClickDirective,
        DummyComponent
      ],
      imports: [
        IonicModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'tutorials/interactive-tutorial',
            component: DummyComponent
          },
          {
            path: 'profiles/personal-data',
            component: DummyComponent
          },
          {
            path: 'profiles/user',
            component: DummyComponent
          },
          {
            path: 'notifications/list',
            component: DummyComponent
          }
        ])
      ],
      providers: [
        TrackClickDirective,
        { provide: TabsComponent, useValue: tabsComponentMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserStatusCardComponent);
    component = fixture.componentInstance;
    component.userStatus = userStatusMock;
    fixture.detectChanges();
    tabsComponent = TestBed.inject(TabsComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setNewFundUrl on ngOnInit', () => {
    const spy = spyOn(component, 'setNewFundUrl');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setNewFundUrl on ngOnInit', () => {
    const spy = spyOn(component, 'setNewFundUrl');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return profiles/personal-data when profile not valid', () => {
    component.userStatus = {
      profile_valid: false,
      empty_linked_keys: false,
      has_own_funds: true,
      has_subscribed_funds: true,
      status_name: 'FROM_BOT'
    };
    fixture.detectChanges();
    component.setNewFundUrl();
    fixture.detectChanges();
    expect(component.newFundUrl).toBe('profiles/personal-data');
    expect(tabsComponent.newFundUrl).toBe('profiles/personal-data');
  });

  it('should return apikeys/tutorial when profile valid and not empty linked keys', () => {
    component.userStatus = {
      profile_valid: true,
      empty_linked_keys: false,
      has_own_funds: true,
      has_subscribed_funds: true,
      status_name: 'EXOLORER'
    };
    fixture.detectChanges();
    component.setNewFundUrl();
    fixture.detectChanges();
    expect(component.newFundUrl).toBe('apikeys/tutorial');
    expect(tabsComponent.newFundUrl).toBe('apikeys/tutorial');
  });

  it('should return funds/fund-name when profile valid and empty linked keys', () => {
    component.userStatus = {
      profile_valid: true,
      empty_linked_keys: true,
      has_own_funds: false,
      has_subscribed_funds: false,
      status_name: 'BEGINNER'
    };
    fixture.detectChanges();
    component.setNewFundUrl();
    fixture.detectChanges();
    expect(component.newFundUrl).toBe('funds/fund-name');
    expect(tabsComponent.newFundUrl).toBe('funds/fund-name');
  });

  it('should call trackEvent on trackService when Action Button button clicked', () => {
    component.userStatus = {
      profile_valid: true,
      empty_linked_keys: true,
      has_own_funds: false,
      has_subscribed_funds: false,
      status_name: 'BEGINNER'
    };
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Action Button'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    spyOn(component, 'doActionButton');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

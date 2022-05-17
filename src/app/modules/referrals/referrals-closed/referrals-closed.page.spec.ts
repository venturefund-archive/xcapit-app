import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { ReferralsClosedPage } from './referrals-closed.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ReferralsClosedPage', () => {
  let component: ReferralsClosedPage;
  let fixture: ComponentFixture<ReferralsClosedPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ReferralsClosedPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralsClosedPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-referrals-coming component', () => {
    fixture.detectChanges();
    const componentEl = fixture.debugElement.queryAll(By.css('app-referrals-coming'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });
});

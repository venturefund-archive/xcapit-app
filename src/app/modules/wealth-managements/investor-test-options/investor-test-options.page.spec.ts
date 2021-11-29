import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { InvestorTestOptionsPage } from './investor-test-options.page';
const options = [
  {
    title: 'wealth-managements.investor-test.title1',
    description: 'wealth-managements.investor-test.description1',
    route: '',
  },
  {
    title: 'wealth-managements.investor-test.title2',
    description: 'wealth-managements.investor-test.description2',
    route: '',
  },
];

describe('InvestorTestOptionsPage', () => {
  let component: InvestorTestOptionsPage;
  let fixture: ComponentFixture<InvestorTestOptionsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [InvestorTestOptionsPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestorTestOptionsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-support-options-card component', () => {
    component.options = options;
    fixture.detectChanges();
    const appTestItem = fixture.debugElement.queryAll(By.css('app-test-option-item'));
    fixture.detectChanges();
    expect(appTestItem.length).toBe(2);
  });
});

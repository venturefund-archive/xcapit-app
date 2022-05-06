import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { CausesPage } from './causes.page';

describe('CausesPage', () => {
  let component: CausesPage;
  let fixture: ComponentFixture<CausesPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ CausesPage ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CausesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render cause component properly', () => {
    const causeItemEl = fixture.debugElement.query(By.css('app-cause'));

    expect(causeItemEl).toBeTruthy();
  });

  it('should render title', () => {
    const textEl = fixture.debugElement.query(By.css('.cp__title ion-text'));
    
    expect(textEl).toBeTruthy();
  });

});

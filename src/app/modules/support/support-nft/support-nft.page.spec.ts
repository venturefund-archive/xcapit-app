import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SupportNftPage } from './support-nft.page';

describe('SupportNftPage', () => {
  let component: SupportNftPage;
  let fixture: ComponentFixture<SupportNftPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    TestBed.configureTestingModule({
      declarations: [ SupportNftPage ],
      imports: [IonicModule.forRoot(),TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportNftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

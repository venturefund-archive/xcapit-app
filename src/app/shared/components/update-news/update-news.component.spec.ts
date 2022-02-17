import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { UpdateNewsComponent } from './update-news.component';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { News } from '../../interfaces/news.interface';

describe('UpdateNewsComponent', () => {
  let component: UpdateNewsComponent;
  let fixture: ComponentFixture<UpdateNewsComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let testItems: News[];

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      testItems = [
        {
          badge: 'testBadge',
          title: 'testTitle',
          description: 'testDescription',
          url: '/test/url',
        },
      ];
      TestBed.configureTestingModule({
        declarations: [UpdateNewsComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UpdateNewsComponent);
      component = fixture.componentInstance;
      component.items = testItems;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', async () => {
    const button = fixture.debugElement.query(By.css('ion-button[name="Close"]'));
    button.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should navigate to feature url and close modal', async () => {
    const item = fixture.debugElement.query(By.css('app-news-item'));
    item.triggerEventHandler('clicked', '/test/url');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/test/url');
  });
});

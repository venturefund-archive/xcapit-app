import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { InProgressTransactionModalComponent } from './in-progress-transaction-modal.component';

const testData = {
  image:"assets/test_image.svg",
  icon: "assets/test_icon.svg",
  urlClose:'/tabs/wallets',
  textPrimary: 'textPrimary',
  textSecondary:'textSecondary',
  namePrimaryAction:'primaryAction',
  urlPrimaryAction:'/tabs/wallets',
  titlePrimary: 'title',
  textBadge: 'badge'
}

describe('InProgressTransactionModalComponent', () => {
  let component: InProgressTransactionModalComponent;
  let fixture: ComponentFixture<InProgressTransactionModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [InProgressTransactionModalComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InProgressTransactionModalComponent);
    component = fixture.componentInstance;
    component.data = testData;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render properly', () =>{
    const imgEl = fixture.debugElement.query(By.css("div.ipt__header__img > img"));
    const iconEl = fixture.debugElement.query(By.css("div.ipt__main__icon > img"));
    const titleEl = fixture.debugElement.query(By.css("div.ipt__main__primary-title > ion-text"));
    const badgeEl = fixture.debugElement.query(By.css("div.ipt__main__badge > ion-badge"));
    const primaryTextEl = fixture.debugElement.query(By.css("div.ipt__main__primary-text > app-ux-title"));
    const secondaryTextEl = fixture.debugElement.query(By.css("div.ipt__main__secondary-text > ion-text"));
    expect(imgEl.attributes.src).toContain('assets/test_image.svg');
    expect(iconEl.attributes.src).toContain('assets/test_icon.svg');
    expect(titleEl.nativeElement.innerHTML).toEqual('title')
    expect(primaryTextEl.nativeElement.innerHTML).toEqual('textPrimary')
    expect(secondaryTextEl.nativeElement.innerHTML).toEqual('textSecondary')
    expect(badgeEl.nativeNode.innerHTML).toEqual('badge')
  })

  it('should router navigate when Close Success is clicked', () => {
    const closeButtonEl = fixture.debugElement.query(By.css("ion-button[name='Close Success']"));
    closeButtonEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlClose]);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should router navigate when Success Action Primary is clicked', () => {
    const primaryButtonEl = fixture.debugElement.query(By.css("ion-button[name='Success Action Primary']"));
    primaryButtonEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlPrimaryAction]);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
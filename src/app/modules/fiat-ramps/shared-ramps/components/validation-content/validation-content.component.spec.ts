import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakePhotoSource } from 'src/app/shared/models/photo-source/fake/fake-photo-source';
import { UploadedPhotoInjectable } from 'src/app/shared/models/uploaded-photo/injectable/uploaded-photo.injectable';
import { UploadedPhoto } from 'src/app/shared/models/uploaded-photo/uploaded-photo';
import { UserKycKriptonImagesService } from '../../services/user-kyc-kripton-images/user-kyc-kripton-images.service';
import { ValidationContentComponent } from './validation-content.component';

describe('ValidationContentComponent', () => {
  let component: ValidationContentComponent;
  let fixture: ComponentFixture<ValidationContentComponent>;
  let uploadedPhotoInjectableSpy: jasmine.SpyObj<UploadedPhotoInjectable>;
  let userKycKriptonImagesServiceSpy: jasmine.SpyObj<UserKycKriptonImagesService>;
  let platformSpy: jasmine.SpyObj<Platform>;
  const data = {
    step_from: 1,
    title: 'testTitle',
    description: 'testDescription',
    imagePath: 'assets/test_image.svg',
    documentName: 'front_document',
  };

  beforeEach(waitForAsync(() => {
    uploadedPhotoInjectableSpy = jasmine.createSpyObj('UploadedPhotoInjectable', {
      create: new UploadedPhoto(new FakePhotoSource()),
    });
    userKycKriptonImagesServiceSpy = jasmine.createSpyObj('UserKycKriptonDataService', {
      update: null,
    });
    platformSpy = jasmine.createSpyObj(
      'Platform',
      {},
      { backButton: { subscribeWithPriority: () => {}} }
    );

    TestBed.configureTestingModule({
      declarations: [ValidationContentComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: UploadedPhotoInjectable, useValue: uploadedPhotoInjectableSpy },
        { provide: UserKycKriptonImagesService, useValue: userKycKriptonImagesServiceSpy },
        { provide: Platform, useValue: platformSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationContentComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should suscribe to backButton gesture onInit', () => {
    const spy = spyOn(platformSpy.backButton, 'subscribeWithPriority');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should save uploaded photo from camera', async () => {
    const spy = spyOn(component.confirm, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="take_photo"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(userKycKriptonImagesServiceSpy.update).toHaveBeenCalledOnceWith({ front_document: 'testPath' });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should save uploaded photo from gallery', async () => {
    const spy = spyOn(component.confirm, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="upload_photo"]')).nativeElement.click();
    await fixture.whenStable();
    expect(userKycKriptonImagesServiceSpy.update).toHaveBeenCalledOnceWith({ front_document: 'testPath' });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit when back button is clicked', () => {
    const spy = spyOn(component.backButton, 'emit');
    fixture.debugElement.query(By.css('ion-button.vc__button-back')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('div.vc__container__title > ion-text'));
    const itemsEl = fixture.debugElement.query(By.css('div.vc__container__description > ion-text'));
    const imageEl = fixture.debugElement.query(By.css('div.vc__container__image > img'));

    expect(titleEl.nativeElement.innerHTML).toContain('testTitle');
    expect(itemsEl.nativeElement.innerHTML).toContain('testDescription');
    expect(imageEl.attributes.src).toEqual('assets/test_image.svg');
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FundShareChartComponent } from './fund-share-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ShareService } from '../../../../../shared/services/share/share.service';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { WriteFileResult } from '@capacitor/filesystem';
import { PlatformService } from '../../../../../shared/services/platform/platform.service';

describe('FundShareChartComponent', () => {
  let component: FundShareChartComponent;
  let fixture: ComponentFixture<FundShareChartComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundShareChartComponent>;
  let modalControllerSpy: any;
  let fileOpenerMock: any;
  let fileOpener: any;
  let fileSystemMock: any;
  let toastServiceMock: any;
  let toastService: any;
  let shareServiceSpy: any;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;

  const resultFileWrite = {
    uri: 'download/test.png',
  } as WriteFileResult;

  beforeEach(() => {
    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
    });
    shareServiceSpy = jasmine.createSpyObj('ShareService', ['share']);
    modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
    fileOpenerMock = {
      showOpenWithDialog: () => Promise.resolve({}),
    };
    fileSystemMock = {
      writeFile: () => Promise.resolve({}),
    };
    toastServiceMock = {
      showToast: () => Promise.resolve(),
    };

    TestBed.configureTestingModule({
      declarations: [FundShareChartComponent, FakeTrackClickDirective],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: FileOpener, useValue: fileOpenerMock },
        { provide: ShareService, useValue: shareServiceSpy },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    toastService = TestBed.inject(ToastService);
    fileOpener = TestBed.inject(FileOpener);
    fixture = TestBed.createComponent(FundShareChartComponent);
    component = fixture.componentInstance;
    component.fileSystem = fileSystemMock;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ModalController dismiss on close', () => {
    component.close();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Close is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call nativeDownload on downloadChart if isNative true', () => {
    const spy = spyOn(component, 'nativeDownload');
    component.downloadChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call pwaDownload on downloadChart if isNative false', () => {
    platformServiceSpy.isNative.and.returnValue(false);
    const spy = spyOn(component, 'pwaDownload');
    component.downloadChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call fileSystemWrite,  and showToast and openFile if write is successfully on nativeDownload', async () => {
    const spy = spyOn(component.fileSystem, 'writeFile').and.returnValue(Promise.resolve(resultFileWrite));
    const spyToast = spyOn(component, 'showToast');
    const spyOpenFile = spyOn(component, 'openImage');
    await component.nativeDownload();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyToast).toHaveBeenCalledTimes(1);
    expect(spyOpenFile).toHaveBeenCalledTimes(1);
  });

  it('should call toastService on showToast', () => {
    const spy = spyOn(toastService, 'showToast');
    component.showToast('some_error_code');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call FileOpener. on openImage', () => {
    const spy = spyOn(fileOpener, 'showOpenWithDialog');
    component.openImage('download/test.png', 'image/png');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

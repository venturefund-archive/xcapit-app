import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundShareChartComponent } from './fund-share-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Capacitor } from '@capacitor/core';
import {
  Plugins,
  FileWriteResult,
} from '@capacitor/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

describe('FundShareChartComponent', () => {
  let component: FundShareChartComponent;
  let fixture: ComponentFixture<FundShareChartComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundShareChartComponent>;
  let modalControllerSpy: any;
  let capacitorSpy: any;
  let fileOpenerMock: any;
  let fileOpener: any;
  let fileSystemMock: any;
  let toastServiceMock: any;
  let toastService: any;

  const result_file_write = {
    uri: 'download/test.png',
  } as FileWriteResult;

  beforeEach(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    capacitorSpy = jasmine.createSpyObj('Capacitor', ['isNative']);
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
      declarations: [FundShareChartComponent, TrackClickDirective],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: Capacitor, useValue: capacitorSpy },
        { provide: FileOpener, useValue: fileOpenerMock },
        { provide: Plugins.Share, useValue: fileSystemMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    toastService = TestBed.inject(ToastService);
    fileOpener = TestBed.inject(FileOpener);
    fixture = TestBed.createComponent(FundShareChartComponent);
    component = fixture.componentInstance;
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
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Close'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call nativeDownload on downloadChart if isNative true', () => {
    Capacitor.isNative = true;
    const spy = spyOn(component, 'nativeDownload');
    component.downloadChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call pwaDownload on downloadChart if isNative false', () => {
    Capacitor.isNative = false;
    const spy = spyOn(component, 'pwaDownload');
    component.downloadChart();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call fileSystemWrite,  and showToast and openFile if write is successfully on nativeDownload', async (done) => {
    const spy = spyOn(Plugins.Filesystem, 'writeFile').and.returnValue(
      Promise.resolve(result_file_write)
    );
    const spyToast = spyOn(component, 'showToast');
    const spyOpenFile = spyOn(component, 'openImage');
    component.nativeDownload();
    expect(spy).toHaveBeenCalledTimes(1);
    fixture.whenStable().then(() => expect(spyToast).toHaveBeenCalledTimes(1));
    fixture
      .whenStable()
      .then(() => expect(spyOpenFile).toHaveBeenCalledTimes(1));
    done();
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TermsAndConditionsCheckComponent } from './one-inch-tos-check.component';


describe('TermsAndConditionsCheckComponent', () => {
  let component: TermsAndConditionsCheckComponent;
  let fixture: ComponentFixture<TermsAndConditionsCheckComponent>;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;


  beforeEach(waitForAsync(() => {
    storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve(),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsCheckComponent ],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: IonicStorageService, useValue: storageServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open browser in app when 1inch ToS is clicked', async () => {
    const labelEl = fixture.debugElement.query(By.css('ion-button[name="go_to_1inch_tos"]'));

    labelEl.nativeElement.click();

    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: LINKS.oneInchToS });
  });

  it('should emit event & call set storage method when checkbox is clicked', () => {
    spyOn(component.toggledCheckbox, 'emit');

    fixture.debugElement.query(By.css("ion-checkbox[name='checkbox-condition']"))
      .triggerEventHandler('ionChange',  { detail: { checked: true} });

    expect(storageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(component.toggledCheckbox.emit).toHaveBeenCalledTimes(1);
  });
});

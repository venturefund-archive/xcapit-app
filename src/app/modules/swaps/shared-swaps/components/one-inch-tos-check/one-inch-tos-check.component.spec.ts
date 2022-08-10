import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { OneInchTosCheckComponent } from './one-inch-tos-check.component';


describe('OneInchTosCheckComponent', () => {
  let component: OneInchTosCheckComponent;
  let fixture: ComponentFixture<OneInchTosCheckComponent>;
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
      declarations: [ OneInchTosCheckComponent ],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: IonicStorageService, useValue: storageServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OneInchTosCheckComponent);
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
    component.showCheck = true;
    fixture.detectChanges();
    spyOn(component.toggledCheckbox, 'emit');

    fixture.debugElement.query(By.css("ion-checkbox[name='checkbox-condition']"))
      .triggerEventHandler('ionChange',  { detail: { checked: true} });

    expect(storageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(component.toggledCheckbox.emit).toHaveBeenCalledTimes(1);
  });

  it('should cancel Tos on cancelTos change', async () => {
    component.cancelTos = true;

    component.ngOnChanges({ cancelTos: new SimpleChange(false, true, false)});

    expect(storageServiceSpy.set).toHaveBeenCalledWith(component.key, false);
  });
});

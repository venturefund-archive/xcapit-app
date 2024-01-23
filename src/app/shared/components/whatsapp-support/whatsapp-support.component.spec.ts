import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from '../../services/browser/browser.service';

import { WhatsappSupportComponent } from './whatsapp-support.component';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';

describe('WhatsappSupportComponent', () => {
  let component: WhatsappSupportComponent;
  let fixture: ComponentFixture<WhatsappSupportComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getString: 'https://wa.link/usb97c',
    });

    TestBed.configureTestingModule({
      declarations: [WhatsappSupportComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open whatsapp when link is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="whatsApp"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://wa.link/usb97c' });
  });
});

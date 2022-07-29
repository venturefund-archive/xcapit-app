import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, of } from 'rxjs';
import { SpyProperty } from 'src/testing/spy-property.spec';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

import { EyeComponent } from './eye.component';

describe('EyeComponent', () => {
  let component: EyeComponent;
  let fixture: ComponentFixture<EyeComponent>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  beforeEach(waitForAsync(() => {
    localStorageServiceSpy = jasmine.createSpyObj(
        'LocalStorageService',
        {
          toggleHideFunds: undefined,
        },
        { hideFunds: of(false) }
      );
    TestBed.configureTestingModule({
      declarations: [ EyeComponent ],
      imports: [IonicModule.forRoot()],
      providers:[ { provide: LocalStorageService, useValue: localStorageServiceSpy },]
    }).compileComponents();

    fixture = TestBed.createComponent(EyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render open eye when hideFundsText false', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const [eyeClose, eyeOpen] = fixture.debugElement.queryAll(By.css('a.eye ion-icon'));
    expect(eyeOpen.properties['hidden']).toEqual(false);
    expect(eyeClose.properties['hidden']).toEqual(true);
  });

  it('should render closed eye when hideFundsText true', async () => {
    new SpyProperty(localStorageServiceSpy, 'hideFunds').value().and.returnValue(new BehaviorSubject(true));
    component.ngOnInit();
    fixture.detectChanges();
    const [eyeClose, eyeOpen] = fixture.debugElement.queryAll(By.css('a.eye ion-icon'));
    expect(eyeOpen.properties['hidden']).toEqual(true);
    expect(eyeClose.properties['hidden']).toEqual(false);
  });

  it('should call toggleHideFunds when eye button is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.debugElement.query(By.css('a.eye')).nativeElement.click();
    fixture.detectChanges();
    expect(localStorageServiceSpy.toggleHideFunds).toHaveBeenCalled();
  });

});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { ReferralsTosPage } from './referrals-tos.page';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';
import { getAttribute } from '@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils';

describe('ReferralsTosPage', () => {
  let component: ReferralsTosPage;
  let fixture: ComponentFixture<ReferralsTosPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let elementRefSpy: jasmine.SpyObj<ElementRef>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      elementRefSpy = jasmine.createSpyObj(
        'ElementRef',
        {},
        {
          nativeElement: {
            querySelectorAll: () => [
              {
                addEventListener: () => null,
              },
            ],
          },
        }
      );
      TestBed.configureTestingModule({
        declarations: [ReferralsTosPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ElementRef, useValue: elementRefSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralsTosPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    await fixture.whenRenderingDone();
    const subtitlesEl = fixture.debugElement.queryAll(By.css('.rt__title'));
    expect(subtitlesEl.length).toBe(1);
  });

  it('should render all paragraphs', async () => {
    await fixture.whenRenderingDone();
    const subtitlesEl = fixture.debugElement.queryAll(By.css('.rt__paragraph'));
    expect(subtitlesEl.length).toBe(11);
  });

  it('should render all subtitles', async () => {
    await fixture.whenRenderingDone();
    const subtitlesEl = fixture.debugElement.queryAll(By.css('.rt__subtitle'));
    expect(subtitlesEl.length).toBe(10);
  });

  it('should redirect to href link', async () => {
    await fixture.whenRenderingDone();
    const eventMock = {
      preventDefault: () => null,
      target: {
        getAttribute: () => '/referrals/tos',
      } as unknown as EventTarget,
    };
    component.handleAnchorClick(eventMock as unknown as Event);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/referrals/tos');
  });
});

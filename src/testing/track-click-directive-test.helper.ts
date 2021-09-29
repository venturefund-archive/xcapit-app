import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FakeTrackClickDirective } from './fakes/track-click-directive.fake.spec';

export class TrackClickDirectiveTestHelper<T> {
  fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  getByElementByName(element: string, name: string) {
    return this.fixture.debugElement.query(By.css(`${element}[name="${name}"]`));
  }

  getElement(element: string) {
    return this.fixture.debugElement.query(By.css(`${element}`));
  }

  getDirective(element: DebugElement): FakeTrackClickDirective {
    return element.injector.get(FakeTrackClickDirective) as FakeTrackClickDirective;
  }

  getAllElementsWithTheDirective() {
    return this.fixture.debugElement.queryAll(By.directive(FakeTrackClickDirective));
  }

  getFirstElementWithTheDirective() {
    const all = this.getAllElementsWithTheDirective();
    return all.length ? all[0] : null;
  }

  getLastElementWithTheDirective() {
    const all = this.getAllElementsWithTheDirective();
    return all.length ? all[all.length - 1] : null;
  }
}

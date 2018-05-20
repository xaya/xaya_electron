import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesnavbarComponent } from './pagesnavbar.component';

describe('PagesnavbarComponent', () => {
  let component: PagesnavbarComponent;
  let fixture: ComponentFixture<PagesnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

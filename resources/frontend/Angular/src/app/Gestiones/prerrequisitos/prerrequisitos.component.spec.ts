import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerrequisitosComponent } from './prerrequisitos.component';

describe('PrerrequisitosComponent', () => {
  let component: PrerrequisitosComponent;
  let fixture: ComponentFixture<PrerrequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrerrequisitosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrerrequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

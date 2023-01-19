import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquisicionesComponent } from './adquisiciones.component';

describe('AdquisicionesComponent', () => {
  let component: AdquisicionesComponent;
  let fixture: ComponentFixture<AdquisicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdquisicionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdquisicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

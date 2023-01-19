import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCursosGeneralComponent } from './tabla-cursos-general.component';

describe('TablaCursosGeneralComponent', () => {
  let component: TablaCursosGeneralComponent;
  let fixture: ComponentFixture<TablaCursosGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaCursosGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaCursosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaDetalleInscripcionesComponent } from './pagina-detalle-inscripciones.component';

describe('PaginaDetalleInscripcionesComponent', () => {
  let component: PaginaDetalleInscripcionesComponent;
  let fixture: ComponentFixture<PaginaDetalleInscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaDetalleInscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaDetalleInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

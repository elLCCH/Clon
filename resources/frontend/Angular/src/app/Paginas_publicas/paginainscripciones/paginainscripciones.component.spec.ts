import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginainscripcionesComponent } from './paginainscripciones.component';

describe('PaginainscripcionesComponent', () => {
  let component: PaginainscripcionesComponent;
  let fixture: ComponentFixture<PaginainscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginainscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginainscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

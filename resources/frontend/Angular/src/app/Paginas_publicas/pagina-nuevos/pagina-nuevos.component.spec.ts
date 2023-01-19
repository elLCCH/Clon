import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNuevosComponent } from './pagina-nuevos.component';

describe('PaginaNuevosComponent', () => {
  let component: PaginaNuevosComponent;
  let fixture: ComponentFixture<PaginaNuevosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaNuevosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNuevosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAntiguosComponent } from './lista-antiguos.component';

describe('ListaAntiguosComponent', () => {
  let component: ListaAntiguosComponent;
  let fixture: ComponentFixture<ListaAntiguosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaAntiguosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAntiguosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
